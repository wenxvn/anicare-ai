import pathlib

base = pathlib.Path(r'D:\wenxvn\CARIC')

# requirements.txt
(base / 'requirements.txt').write_text('''fastapi>=0.100.0
uvicorn>=0.23.0
httpx>=0.24.0
python-dotenv>=1.0.0
pydantic>=2.0.0
''', encoding='utf-8')

# environment.yml
(base / 'environment.yml').write_text('''name: CARIC
channels:
  - defaults
  - conda-forge
dependencies:
  - python=3.11.9
  - pip
  - pip:
    - fastapi>=0.100.0
    - uvicorn>=0.23.0
    - httpx>=0.24.0
    - python-dotenv>=1.0.0
    - pydantic>=2.0.0
''', encoding='utf-8')

# .env.example
(base / '.env.example').write_text('''# 后端 API 地址（前端 Next.js 代理用）
NEXT_PUBLIC_API_BASE=http://localhost:8000/api

# FastAPI 后端配置
HOST=0.0.0.0
PORT=8000

# OpenAI API Key（后期接入 RAG/LLM 时使用）
# OPENAI_API_KEY=sk-xxx
''', encoding='utf-8')

print('config files created')