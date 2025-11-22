const request = require('supertest');
const { app, server } = require('../index');
const prisma = require('../prisma/client');

describe('Issue Endpoints', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Create a user and get token
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Issue Tester',
        email: `issuetest${Date.now()}@example.com`,
        password: 'password123',
        phone: '9999999999',
        area: 'Test Ward'
      });
    
    token = userRes.body.token;
    userId = userRes.body._id;
  });

  afterAll(async () => {
    await prisma.issue.deleteMany({ where: { user_id: userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
    server.close();
  });

  it('should create a new issue', async () => {
    const res = await request(app)
      .post('/api/issues')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Issue')
      .field('description', 'This is a test issue')
      .field('category', 'Road')
      .field('priority', 'medium')
      .field('latitude', '12.9716')
      .field('longitude', '77.5946');
      // Note: Image upload testing requires attaching a file, skipping for basic test

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual('Test Issue');
  });

  it('should get all issues', async () => {
    const res = await request(app)
      .get('/api/issues');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
