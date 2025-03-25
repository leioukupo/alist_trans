# 使用Python官方镜像作为基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制项目文件到容器中
COPY . /app
RUN chmod +x ./BaiduPCS-Go
# 创建并激活虚拟环境
RUN python -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 设置容器启动命令
# 注意：这里需要根据实际项目的启动方式进行修改
CMD ["python", "api.py"]

