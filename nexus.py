from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
import os, sqlite3, uvicorn
app = FastAPI()
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nexus_master.db')
conn = sqlite3.connect(DB_PATH); conn.execute('CREATE TABLE IF NOT EXISTS metrics (id TEXT PRIMARY KEY, tipo_evento TEXT, valor TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)'); conn.close()
@app.get('/')
def home(): return {'status': 'Online'}
@app.post('/registrar-metrica')
def reg_m(tipo: str = Form(...), valor: str = Form(...)): conn = sqlite3.connect(DB_PATH); conn.execute('INSERT INTO metrics (id, tipo_evento, valor) VALUES (hex(randomblob(4)), ?, ?)', (tipo, valor)); conn.commit(); conn.close(); return {'status': 'Guardado'}
