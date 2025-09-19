import os
import json
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import random
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
import pickle

# ---------------------------
# 设置随机种子，保证结果可复现
# ---------------------------
def set_seed(seed=44):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

set_seed(44)

plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

MAX_LEN = 99
FEATURES = ['angle', 'torque', 'current']
DATA_DIR = './data'
RESULT_DIR = './switch'
BATCH_SIZE = 2
EPOCHS = 44
LR = 5e-4
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
os.makedirs(RESULT_DIR, exist_ok=True)

# ---------------------------
# 数据读取与预处理
# ---------------------------
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
    if len(seq) >= max_len:
        return seq[:max_len]
    else:
        pad_len = max_len - len(seq)
        pad = np.zeros((pad_len, seq.shape[1]))
        return np.vstack([seq, pad])

def load_data_from_folder(folder_path, label):
    data_list = []
    label_list = []
    for fname in os.listdir(folder_path):
        if fname.endswith('.txt'):
            arr = read_txt_file(os.path.join(folder_path, fname))
            if len(arr) == 0:
                continue
            arr = pad_or_truncate(arr, MAX_LEN)
            data_list.append(arr)
            label_list.append(label)
    return data_list, label_list

normal_data, normal_labels = load_data_from_folder(os.path.join(DATA_DIR, 'normal'), 0)
stuck_data, stuck_labels = load_data_from_folder(os.path.join(DATA_DIR, 'stuck'), 1)

X = np.array(normal_data + stuck_data)
y = np.array(normal_labels + stuck_labels)

nsamples, nsteps, nfeatures = X.shape
X = X.reshape(-1, nfeatures)
scaler = MinMaxScaler()
X = scaler.fit_transform(X)
X = X.reshape(nsamples, nsteps, nfeatures)

current_script_dir = os.path.dirname(os.path.abspath(__file__))
# 1. 定义保存路径（按你指定的路径）
scaler_X_dir = os.path.join(current_script_dir,  "switch")  # 用os.path.join拼接，跨平台更安全
scaler_X_path = os.path.join(scaler_X_dir, 'scaler_X.pkl')  # 完整动态路径

# 2. 创建目录（若不存在则自动创建，避免路径不存在报错）
os.makedirs(scaler_X_dir, exist_ok=True)

# 3. 用pickle保存归一化器
with open(scaler_X_path, 'wb') as f:
    pickle.dump(scaler, f)  # 将训练好的MinMaxScaler保存到文件
print(f"特征归一化器已保存至：{scaler_X_path}")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

class SwitchDataset(Dataset):
    def __init__(self, data, labels):
        self.data = torch.tensor(data, dtype=torch.float32)
        self.labels = torch.tensor(labels, dtype=torch.float32)
    def __len__(self):
        return len(self.labels)
    def __getitem__(self, idx):
        return self.data[idx], self.labels[idx]

train_dataset = SwitchDataset(X_train, y_train)
test_dataset = SwitchDataset(X_test, y_test)
train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)

# ---------------------------
# 模型定义 CNN + BiLSTM
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

# ---------------------------
# pos_weight 权重设置
# ---------------------------
num_pos = sum(y_train == 1)
num_neg = sum(y_train == 0)
pos_weight = torch.tensor([num_neg / num_pos], dtype=torch.float32).to(DEVICE)

model = CNN_BiLSTM(input_features=len(FEATURES)).to(DEVICE)
criterion = nn.BCEWithLogitsLoss(pos_weight=pos_weight)
optimizer = torch.optim.Adam(model.parameters(), lr=LR)

# ---------------------------
# 训练与验证函数
# ---------------------------
def train_epoch(model, dataloader, criterion, optimizer):
    model.train()
    running_loss, correct, total = 0, 0, 0
    for data, label in dataloader:
        data, label = data.to(DEVICE), label.to(DEVICE)
        optimizer.zero_grad()
        outputs = model(data)
        loss = criterion(outputs, label)
        loss.backward()
        optimizer.step()
        running_loss += loss.item() * data.size(0)
        preds = (torch.sigmoid(outputs) > 0.5).float()
        correct += (preds == label).sum().item()
        total += data.size(0)
    return running_loss / total, correct / total

def eval_epoch(model, dataloader, criterion):
    model.eval()
    running_loss, correct, total = 0, 0, 0
    all_preds, all_labels = [], []
    with torch.no_grad():
        for data, label in dataloader:
            data, label = data.to(DEVICE), label.to(DEVICE)
            outputs = model(data)
            loss = criterion(outputs, label)
            running_loss += loss.item() * data.size(0)
            preds = (torch.sigmoid(outputs) > 0.5).float()
            correct += (preds == label).sum().item()
            total += data.size(0)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(label.cpu().numpy())
    return running_loss / total, correct / total, np.array(all_preds), np.array(all_labels)

train_losses, train_accs, val_losses, val_accs = [], [], [], []
for epoch in range(1, EPOCHS + 1):
    train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer)
    val_loss, val_acc, _, _ = eval_epoch(model, test_loader, criterion)
    train_losses.append(train_loss); train_accs.append(train_acc)
    val_losses.append(val_loss); val_accs.append(val_acc)
    print(f"Epoch {epoch}/{EPOCHS} | Train Loss: {train_loss:.4f} Acc: {train_acc:.4f} | Val Loss: {val_loss:.4f} Acc: {val_acc:.4f}")

plt.figure(figsize=(12,4))
plt.subplot(1,2,1)
plt.plot(train_losses, label='训练损失')
plt.plot(val_losses, label='验证损失')
plt.title("损失曲线")
plt.xlabel("轮次"); plt.ylabel("损失")
plt.legend()
plt.subplot(1,2,2)
plt.plot(train_accs, label='训练准确率')
plt.plot(val_accs, label='验证准确率')
plt.title("准确率曲线")
plt.xlabel("轮次"); plt.ylabel("准确率")
plt.legend()
plt.tight_layout()
plt.savefig(os.path.join(RESULT_DIR, "training_curves.png"))
plt.close()

# ---------------------------
# 混淆矩阵可视化（训练集与验证集）
# ---------------------------
def get_all_preds_and_labels(dataloader, model):
    all_preds, all_labels = [], []
    with torch.no_grad():
        for data, label in dataloader:
            data = data.to(DEVICE)
            outputs = model(data)
            preds = (torch.sigmoid(outputs) > 0.5).float().cpu().numpy()
            all_preds.extend(preds)
            all_labels.extend(label.numpy())
    return np.array(all_preds), np.array(all_labels)

train_preds, train_labels = get_all_preds_and_labels(train_loader, model)
test_preds, test_labels = get_all_preds_and_labels(test_loader, model)

train_cm = confusion_matrix(train_labels, train_preds)
test_cm = confusion_matrix(test_labels, test_preds)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
sns.heatmap(train_cm, annot=True, fmt='d', cmap='Greens', ax=axes[0],
            xticklabels=["正常", "卡涩"], yticklabels=["正常", "卡涩"])
axes[0].set_title("训练集混淆矩阵")
axes[0].set_xlabel("预测标签")
axes[0].set_ylabel("真实标签")

sns.heatmap(test_cm, annot=True, fmt='d', cmap='Blues', ax=axes[1],
            xticklabels=["正常", "卡涩"], yticklabels=["正常", "卡涩"])
axes[1].set_title("验证集混淆矩阵")
axes[1].set_xlabel("预测标签")
axes[1].set_ylabel("真实标签")

plt.tight_layout()
plt.savefig(os.path.join(RESULT_DIR, "confusion_matrix_both.png"))
plt.close()

# 分类报告输出（验证集）
report = classification_report(test_labels, test_preds, target_names=["正常", "卡涩"])
print("\n分类报告：\n", report)
with open(os.path.join(RESULT_DIR, "classification_report.txt"), "w", encoding='utf-8') as f:
    f.write(report)

torch.save(model.state_dict(), os.path.join(RESULT_DIR, "GW16.pth"))
print("训练完成，模型及结果保存至", RESULT_DIR)
