const sqlite3 = require('sqlite3').verbose();
const path = require('path');

describe('数据库操作测试', () => {
  let db;

  beforeAll(() => {
    db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'));
  });

  afterAll(() => {
    db.close();
  });

  test('应该能查询到用户数据', (done) => {
    db.all('SELECT * FROM users WHERE phone = ?', ['13800138001'], (err, rows) => {
      expect(err).toBeNull();
      expect(Array.isArray(rows)).toBe(true);
      done();
    });
  });

  test('应该能查询到抽奖记录', (done) => {
    db.all('SELECT * FROM draw_results', [], (err, rows) => {
      expect(err).toBeNull();
      expect(Array.isArray(rows)).toBe(true);
      done();
    });
  });
});