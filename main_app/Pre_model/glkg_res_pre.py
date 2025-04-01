import os
import torch
import torch.nn as nn
import joblib
import numpy as np
# 加载模型
current_path = os.path.dirname(__file__)  # 获取当前文件所在的目录
print("current_path_1:", current_path)
if 'dist' in current_path:
    app01_path = os.path.dirname(current_path)
    print("app01_path:", app01_path)
    model_path = os.path.join(app01_path, "Pre_model/glkg/", "cnn_model.pth")
    scaler_X_path = os.path.join(app01_path, "Pre_model/glkg/", 'scaler_X.pkl')
    scaler_y_path = os.path.join(app01_path, "Pre_model/glkg/", 'scaler_y.pkl')
else:
    model_path = os.path.join("main_app/Pre_model/glkg/", "cnn_model.pth")
    scaler_X_path = os.path.join("main_app/Pre_model/glkg/", 'scaler_X.pkl')
    scaler_y_path = os.path.join("main_app/Pre_model/glkg/", 'scaler_y.pkl')

# 加载标准化模型
scaler_X = joblib.load(scaler_X_path)
scaler_y = joblib.load(scaler_y_path)

# CNN 模型
class CNNModel(nn.Module):
    def __init__(self, input_size):
        super(CNNModel, self).__init__()
        self.conv1 = nn.Conv1d(1, 16, kernel_size=3, padding=1)
        self.conv2 = nn.Conv1d(16, 32, kernel_size=3, padding=1)
        self.fc1 = nn.Linear(32 * input_size, 64)
        self.fc2 = nn.Linear(64, 1)

    def forward(self, x):
        x = x.unsqueeze(1)  # 增加通道维度 (batch, 1, features)
        x = torch.relu(self.conv1(x))
        x = torch.relu(self.conv2(x))
        x = x.view(x.size(0), -1)  # 展平
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x

# 加载模型
input_size = len(scaler_X.mean_)  # 获取输入特征数
model = CNNModel(input_size)
model.load_state_dict(torch.load(model_path))
model.eval()

# 预测函数
def predict_gelikaiguan_res(data):
    """
    预测隔离开关电阻
    :param data: list or numpy array, 格式 [A相电流, B相电流,C相电流, 转动角度, 开关主轴扭矩]
    :return: 预测的隔离开关电阻（已反标准化）
    """
    # 确保数据是二维数组
    data = np.array(data).reshape(1, -1)
    
    # 标准化
    data_scaled = scaler_X.transform(data)
    
    # 转换为 PyTorch Tensor
    data_tensor = torch.tensor(data_scaled, dtype=torch.float32)
    
    # 预测
    with torch.no_grad():
        prediction_scaled = model(data_tensor)
    
    # 反标准化
    prediction_original = scaler_y.inverse_transform(prediction_scaled.numpy())
    
    return prediction_original[0][0]  # 返回单个数值

