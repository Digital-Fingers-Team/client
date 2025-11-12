import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Messaging (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let adminToken: string;
    let teacherToken: string;
    let studentToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = app.get(PrismaService);
        await app.init();

        // Login to get tokens
        const adminLogin = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'admin@finsh.com', password: 'admin123' });
        adminToken = adminLogin.body.access_token;

        const teacherLogin = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'teacher@finsh.com', password: 'teacher123' });
        teacherToken = teacherLogin.body.access_token;

        const studentLogin = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'student1@finsh.com', password: 'student123' });
        studentToken = studentLogin.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/stats (GET)', () => {
        it('should return overview stats for admin', () => {
            return request(app.getHttpServer())
                .get('/stats/overview')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('users');
                    expect(res.body).toHaveProperty('courses');
                    expect(res.body).toHaveProperty('enrollments');
                    expect(res.body).toHaveProperty('messages');
                });
        });

        it('should return engagement stats for admin', () => {
            return request(app.getHttpServer())
                .get('/stats/engagement')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('recentMessages');
                    expect(res.body).toHaveProperty('activeUsers');
                });
        });

        it('should deny access to non-admin', () => {
            return request(app.getHttpServer())
                .get('/stats/overview')
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(403);
        });
    });

    describe('/users (GET)', () => {
        it('should return list of users', () => {
            return request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBeGreaterThan(0);
                    expect(res.body[0]).toHaveProperty('id');
                    expect(res.body[0]).toHaveProperty('firstName');
                    expect(res.body[0]).toHaveProperty('lastName');
                    expect(res.body[0]).toHaveProperty('role');
                });
        });
    });

    describe('/conversations (GET)', () => {
        it('should return user conversations', () => {
            return request(app.getHttpServer())
                .get('/conversations')
                .set('Authorization', `Bearer ${teacherToken}`)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                });
        });
    });

    describe('/conversations (POST)', () => {
        it('should create a new conversation', async () => {
            const users = await prisma.user.findMany({ take: 2 });
            return request(app.getHttpServer())
                .post('/conversations')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ participantIds: users.map(u => u.id) })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body).toHaveProperty('participants');
                });
        });
    });

    describe('/conversations/:id/messages (GET)', () => {
        it('should return messages in conversation', async () => {
            const conversation = await (prisma as any).conversation.findFirst();
            if (!conversation) return; // Skip if no conversation exists

            return request(app.getHttpServer())
                .get(`/conversations/${conversation.id}/messages`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                });
        });
    });

    describe('/conversations/:id/messages (POST)', () => {
        it('should send a message in conversation', async () => {
            const conversation = await (prisma as any).conversation.findFirst();
            if (!conversation) return; // Skip if no conversation exists

            return request(app.getHttpServer())
                .post(`/conversations/${conversation.id}/messages`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ content: 'Test message' })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body).toHaveProperty('content', 'Test message');
                });
        });
    });

    describe('/files/uploads (POST)', () => {
        it('should upload a file for messaging', () => {
            return request(app.getHttpServer())
                .post('/files/uploads')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('file', Buffer.from('test file content'), 'test.txt')
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body).toHaveProperty('originalName', 'test.txt');
                });
        });
    });
});
