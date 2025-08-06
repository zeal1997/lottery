const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// 数据库连接
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

// CSV文件路径
const csvPath = path.join(__dirname, 'users.csv');

// 读取CSV文件
function readCSV(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.trim().split('\n');
    
    // 跳过标题行（如果有）
    const startIndex = lines[0].includes('用户名') || lines[0].includes('phone') ? 1 : 0;
    
    const users = [];
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const [phone, password] = line.split(',').map(item => item.trim());
        if (phone && password) {
          users.push({ phone, password });
        }
      }
    }
    return users;
  } catch (error) {
    console.error('读取CSV文件失败:', error.message);
    return [];
  }
}

// 插入用户数据
function importUsers(users) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT OR IGNORE INTO users (phone, password) VALUES (?, ?)');
    let insertedCount = 0;
    let errorCount = 0;

    users.forEach((user, index) => {
      stmt.run(user.phone, user.password, function(err) {
        if (err) {
          console.error(`插入用户 ${user.phone} 失败:`, err.message);
          errorCount++;
        } else if (this.changes > 0) {
          insertedCount++;
          console.log(`成功插入用户: ${user.phone}`);
        } else {
          console.log(`用户已存在，跳过: ${user.phone}`);
        }

        if (index === users.length - 1) {
          stmt.finalize();
          resolve({ insertedCount, errorCount });
        }
      });
    });

    if (users.length === 0) {
      stmt.finalize();
      resolve({ insertedCount, errorCount });
    }
  });
}

// 主函数
async function main() {
  console.log('开始导入用户数据...');
  
  // 检查CSV文件是否存在
  if (!fs.existsSync(csvPath)) {
    console.error('错误: users.csv 文件不存在');
    process.exit(1);
  }

  // 读取CSV数据
  const users = readCSV(csvPath);
  
  if (users.length === 0) {
    console.log('没有需要导入的用户数据');
    db.close();
    return;
  }

  console.log(`读取到 ${users.length} 条用户记录`);

  try {
    // 导入数据
    const result = await importUsers(users);
    console.log(`导入完成！成功插入: ${result.insertedCount} 条，失败: ${result.errorCount} 条`);
  } catch (error) {
    console.error('导入过程出错:', error.message);
  } finally {
    db.close();
  }
}

// 运行脚本
main();