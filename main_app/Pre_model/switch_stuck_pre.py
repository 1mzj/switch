# switch_stuck_pre.py
import os
import json
import numpy as np
import torch
import torch.nn as nn
from sklearn.preprocessing import MinMaxScaler
import pickle

# ---------------------------
# 1. 核心配置（与训练时对齐，可根据实际修改）
# ---------------------------
MAX_LEN = 99
FEATURES = ['angle', 'torque', 'current']
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "switch", "GW16.pth")
SCALER_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "switch", "scaler_X.pkl")

# ---------------------------
# 2. 复用模型结构和工具函数（与之前一致）
# ---------------------------
class CNN_BiLSTM(nn.Module):
    def __init__(self, input_features):
        super(CNN_BiLSTM, self).__init__()
        self.conv1 = nn.Conv1d(in_channels=input_features, out_channels=64, kernel_size=5)
        self.pool = nn.MaxPool1d(kernel_size=2)
        self.dropout1 = nn.Dropout(0.3)
        self.lstm = nn.LSTM(input_size=64, hidden_size=64, num_layers=1, batch_first=True, bidirectional=True)
        self.dropout2 = nn.Dropout(0.3)
        self.fc1 = nn.Linear(64 * 2, 64)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(64, 1)

    def forward(self, x):
        x = x.permute(0, 2, 1)
        x = self.conv1(x)
        x = self.pool(x)
        x = self.dropout1(x)
        x = x.permute(0, 2, 1)
        output, _ = self.lstm(x)
        x = self.dropout2(output[:, -1, :])
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x.view(-1)

def read_txt_file(filepath):
    data = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                j = json.loads(line)
                data.append([float(j[f]) for f in FEATURES])
            except:
                continue
    return np.array(data)

def pad_or_truncate(seq, max_len=MAX_LEN):
    if len(seq) == 0:
        raise ValueError("待诊断文件无有效数据")
    if len(seq) >= max_len:
        return seq[:max_len]
    else:
        pad_len = max_len - len(seq)
        pad = np.zeros((pad_len, seq.shape[1]))
        return np.vstack([seq, pad])

# ---------------------------
# 3. 封装核心诊断函数（供后端调用）
# ---------------------------
def run_stuck_diagnosis(file_path):
    """
    执行卡涩诊断的核心函数
    Args:
        file_path: 待诊断的TXT文件路径（如 "./data/stuck/合闸150N1.txt"）
    Returns:
        dict: 诊断结果（含状态、概率、错误信息）
    """
    try:
        # 1. 加载归一化器
        if not os.path.exists(SCALER_PATH):
            return {"status": "error", "msg": f"未找到归一化器：{SCALER_PATH}"}
        with open(SCALER_PATH, 'rb') as f:
            scaler = pickle.load(f)

        # 2. 加载模型
        if not os.path.exists(MODEL_PATH):
            return {"status": "error", "msg": f"未找到模型：{MODEL_PATH}"}
        model = CNN_BiLSTM(input_features=len(FEATURES)).to(DEVICE)
        model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
        model.eval()

        # 3. 数据预处理
        raw_data = read_txt_file(file_path)
        if len(raw_data) == 0:
            return {"status": "error", "msg": "文件无有效特征数据（angle/torque/current）"}
        aligned_data = pad_or_truncate(raw_data)
        normalized_data = scaler.transform(aligned_data.reshape(-1, len(FEATURES)))
        input_tensor = torch.tensor(normalized_data.reshape(1, MAX_LEN, len(FEATURES)), dtype=torch.float32).to(DEVICE)

        # 4. 模型推理
        with torch.no_grad():
            output = model(input_tensor)
            predict_prob = torch.sigmoid(output).item()
            predict_label = 1 if predict_prob > 0.5 else 0
            result = "卡涩" if predict_label == 1 else "正常"

        # 5. 返回成功结果
        return {
            "status": "success",
            "file_path": file_path,
            "result": result,
            "label": int(predict_label),
            "probability": round(predict_prob, 4),
            "confidence": f"{round(predict_prob * 100, 2)}%"
        }

    except Exception as e:
        # 捕获异常，返回错误信息
        return {"status": "error", "msg": str(e)}