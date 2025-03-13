import json
from flask import Flask, request, jsonify, Response, json, stream_with_context
import subprocess
app = Flask(__name__)

@app.route('/baidu', methods=['POST'])
def baidu_link():
    # 检查是否存在Authorization头部并获取其值
    auth_header = request.headers.get('Authorization')
    # 获取配置文件
    with open('config.json', 'r', encoding='utf-8') as file:
        config = json.load(file)
    path = config[auth_header]
    command_path = config['command_path']
    BDUSS = config['BDUSS']
    STOKEN = config['STOKEN']
    # 如果不在用户列表，返回未授权
    user = config.keys()  # 获取字典的所有键
    # 检查 auth_header 是否在 用户列表 中
    if auth_header not in user:
        return jsonify({'error': 'Unauthorized'}), 401
    # 运行命令转存文件
    data = request.get_json()
    if not data or 'link' not in data:
        return jsonify({'error': 'Missing link parameter'}), 400
    link = data.get("link")
    bduss = "-bduss=" + BDUSS
    stoken = "-stoken=" + STOKEN
    login_command = [command_path, "login", bduss,stoken]
    cd_command = [command_path, "cd", path]
    trans_command = [command_path, "transfer", link]
    try:
        # login 
        result = subprocess.run(login_command, # 脚本路径和参数
                                capture_output=True, # 捕获标准输出和标准错误
                                text=True,         # 以文本模式处理输出
                                check=True)       # 如果脚本返回非零退出码，则抛出异常
        # 打印输出(debug purpose)
        app.logger.debug(f"Stdout: {result.stdout}")
        app.logger.debug(f"Stderr: {result.stderr}")
        # cd 切换路径
        result = subprocess.run(cd_command, # 脚本路径和参数
                                capture_output=True, # 捕获标准输出和标准错误
                                text=True,         # 以文本模式处理输出
                                check=True)       # 如果脚本返回非零退出码，则抛出异常
        # 打印输出(debug purpose)
        app.logger.debug(f"Stdout: {result.stdout}")
        app.logger.debug(f"Stderr: {result.stderr}")        
        # 转存文件
        result = subprocess.run(trans_command, # 脚本路径和参数
                                capture_output=True, # 捕获标准输出和标准错误
                                text=True,         # 以文本模式处理输出
                                check=True)       # 如果脚本返回非零退出码，则抛出异常

        # 打印输出(debug purpose)
        app.logger.debug(f"Stdout: {result.stdout}")
        app.logger.debug(f"Stderr: {result.stderr}")
        return jsonify({'result': result.stdout}), 200
    except subprocess.CalledProcessError as e:
        # 命令执行失败
        app.logger.debug(f"Command failed with error: {e}")
        return jsonify({'error': f'Command execution failed: {e.stderr}'}), 500
    except Exception as e:
        # 其他异常
        app.logger.debug(f"An unexpected error occurred: {e}")
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    with open('config.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
    port = data['port']
    app.debug = True
    app.run(host='::', port=port)