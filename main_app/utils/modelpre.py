import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from sklearn.preprocessing import StandardScaler
import joblib  # 导入joblib库
import os
# 定义神经网络结构
class NeuralNetwork(nn.Module):
    def __init__(self):
        super(NeuralNetwork, self).__init__()
        self.fc1 = nn.Linear(4, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, 2)
    
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)
        return x

def predict_contact_resistance_and_temp(cur, temp, hum, wind, model_file='neural_network_weights.pth', scaler_x_file='scaler_x.pkl', scaler_y_file='scaler_y.pkl'):
    """
    使用预训练的神经网络模型预测接触电阻和设备温度。

    参数：
        cur (float): 输入电流
        temp (float): 输入温度
        hum (float): 输入湿度
        wind (float): 输入风速
        model_path (str): 预训练模型的路径
        scaler_x_path (str): 输入标准化器的路径
        scaler_y_path (str): 输出标准化器的路径

    返回：
        tuple: (预测接触电阻, 预测设备温度)
    """
    # 加载模型
    current_path = os.path.dirname(__file__)  # 获取当前文件所在的目录
    print("current_path_1:", current_path)
    if 'dist' in current_path:
        app01_path = os.path.dirname(current_path)
        print("app01_path:", app01_path)
        model_path = os.path.join(app01_path, "utils/", model_file)
        scaler_x_path = os.path.join(app01_path, "utils/", scaler_x_file)
        scaler_y_path = os.path.join(app01_path, "utils/", scaler_y_file)
    else:
        model_path = os.path.join("main_app/utils/", model_file)
        scaler_x_path = os.path.join("main_app/utils/", scaler_x_file)
        scaler_y_path = os.path.join("main_app/utils/", scaler_y_file)
    print("model_path:", model_path)
    model = NeuralNetwork()
    model.load_state_dict(torch.load(model_path))
    model.eval()

    # 准备输入数据
    x_new = np.array([[cur, temp, hum, wind]])

    # 加载标准化器
    scaler_x = joblib.load(scaler_x_path)
    scaler_y = joblib.load(scaler_y_path)

    # 对输入数据进行标准化
    x_new_scaled = scaler_x.transform(x_new)

    # 转换为 PyTorch 张量
    x_new_tensor = torch.FloatTensor(x_new_scaled)

    # 进行预测
    with torch.no_grad():
        y_pred_tensor = model(x_new_tensor)

    # 转换为 NumPy 数组并反标准化
    y_pred = y_pred_tensor.numpy()
    y_pred_inv = scaler_y.inverse_transform(y_pred)

    # 返回预测结果
    return y_pred_inv[0][0], y_pred_inv[0][1]

# 示例调用
if __name__ == '__main__':
    # 示例输入
    cur = 15.0  # 电流
    temp = 25.0  # 温度
    hum = 60.0  # 湿度
    wind = 5.0  # 风速

    # 预测结果
    resistance, temperature = predict_contact_resistance_and_temp(cur, temp, hum, wind)
    print(f"预测结果：接触电阻: {resistance:.2f}, 设备温度: {temperature:.2f}")
