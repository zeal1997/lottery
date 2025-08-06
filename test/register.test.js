const request = require('supertest');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 创建测试用的Express应用
const app = express();
app.use(express.json());

// 测试数据库路径
const testDbPath = path.join(__dirname, 'test_users.db');

// 在每个测试前设置
beforeEach((done) => {
  // 如果测试数据库存在，删除它
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  // 创建新的测试数据库
  const db = new sqlite3.Database(testDbPath);
  
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      has_drawn BOOLEAN DEFAULT 0,
      winning_prize TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });

  db.close(done);
});

// 在每个测试后清理
afterEach((done) => {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
  done();
});

// 注册路由（复制自server.js）
app.post('/api/register', (req, res) => {
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database(testDbPath);
  
  const { phone, password } = req.body;
  
  if (!phone || !password) {
    return res.status(400).json({ error: '手机号和密码不能为空' });
  }

  const stmt = db.prepare('INSERT OR IGNORE INTO users (phone, password) VALUES (?, ?)');
  stmt.run(phone, password, function(err) {
    if (err) {
      return res.status(500).json({ error: '数据库错误' });
    }
    
    if (this.changes === 0) {
      return res.status(400).json({ error: '用户已存在' });
    }
    
    res.json({ success: true, message: '注册成功' });
  });
  stmt.finalize();
  db.close();
});

const request = require('supertest');
const app = require('../server');

describe('注册API测试', () => {
  beforeAll(async () => {
    // 等待服务器启动
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('应该成功注册新用户', async () => {
    const response = await request(app)
      .post('/api/register')
  
      .send({
        phone: '13800138001',
        password: 'test123456'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('注册成功');
  });

  test('应该拒绝重复注册', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        phone: '13800138001',
        password: 'test123456'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('手机号已存在');
  });

  test('应该拒绝缺少参数的注册', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        phone: '13800138002'
        // 缺少password
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('手机号和密码不能为空');
  });
});