const request = require('supertest');
const app = require('../server');

describe('抽奖结果更新API测试', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // 先注册用户并登录
    await request(app)
      .post('/api/register')
      .send({
        phone: '13800138003',
        password: 'test123456'
      });

    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        phone: '13800138003',
        password: 'test123456'
      });

    authToken = loginResponse.body.token;
    userId = loginResponse.body.user.id;
  });

  test('应该成功更新抽奖结果', async () => {
    const response = await request(app)
      .post('/api/update-draw-result')
      .send({
        prizeId: 1,
        prizeName: '一等奖',
        timestamp: new Date().toISOString()
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('抽奖结果已保存');
  });

  test('应该成功记录谢谢参与', async () => {
    const response = await request(app)
      .post('/api/update-draw-result')
      .send({
        prizeId: 10,
        prizeName: '谢谢参与',
        timestamp: new Date().toISOString()
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('应该拒绝缺少参数的更新', async () => {
    const response = await request(app)
      .post('/api/update-draw-result')
      .send({
        prizeId: 1
        // 缺少prizeName和timestamp
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});