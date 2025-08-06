const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 创建数据库连接
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

// 初始化数据库表
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

// 注册新用户
app.post('/api/register', (req, res) => {
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
});

// 用户登录
app.post('/api/login', (req, res) => {
  const { phone, password } = req.body;
  
  db.get('SELECT * FROM users WHERE phone = ? AND password = ?', [phone, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: '数据库错误' });
    }
    
    if (!row) {
      return res.json({ success: false, error: '手机号或密码错误' });
    }
    
    res.json({ 
      success: true, 
      user: {
        phone: row.phone,
        hasDrawn: Boolean(row.has_drawn),
        winningPrize: row.winning_prize ? JSON.parse(row.winning_prize) : null
      }
    });
  });
});

// 更新抽奖结果
app.post('/api/update-draw-result', (req, res) => {
  const { phone, winningPrize } = req.body;
  
  const stmt = db.prepare('UPDATE users SET has_drawn = 1, winning_prize = ? WHERE phone = ?');
  stmt.run(JSON.stringify(winningPrize), phone, function(err) {
    if (err) {
      return res.status(500).json({ error: '更新抽奖结果失败' });
    }
    
    res.json({ success: true });
  });
  stmt.finalize();
});

// 获取用户信息
app.get('/api/user/:phone', (req, res) => {
  const phone = req.params.phone;
  
  db.get('SELECT phone, has_drawn, winning_prize FROM users WHERE phone = ?', [phone], (err, row) => {
    if (err) {
      return res.status(500).json({ error: '数据库错误' });
    }
    
    if (!row) {
      return res.json({ success: false, error: '用户不存在' });
    }
    
    res.json({
      success: true,
      user: {
        phone: row.phone,
        hasDrawn: Boolean(row.has_drawn),
        winningPrize: row.winning_prize ? JSON.parse(row.winning_prize) : null
      }
    });
  });
});

app.listen(PORT, () => {
  // 第117行修改前
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`数据库文件: ${dbPath}`);
});

// 优雅关闭
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('数据库连接已关闭');
    process.exit(0);
  });
});