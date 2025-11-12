import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Files (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let teacherToken: string;
    let studentToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = app.get(PrismaService);
        await app.init();

        // Login as teacher to get token
        const teacherLogin = await request.default(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'teacher@finsh.com', password: 'teacher123' })
            .expect(201);
        teacherToken = teacherLogin.body.access_token;

        // Login as student to get token
        const studentLogin = await request.default(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'student1@finsh.com', password: 'student123' })
            .expect(201);
        studentToken = studentLogin.body.access_token;
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    describe('/files (POST)', () => {
        it('should upload file as teacher', () => {
            return request.default(app.getHttpServer())
                .post('/files')
                .set('Authorization', `Bearer ${teacherToken}`)
                .attach('file', Buffer.from('test content'), 'test.txt')
                .expect(201);
        });

        it('should reject upload as student', () => {
            return request.default(app.getHttpServer())
                .post('/files')
                .set('Authorization', `Bearer ${studentToken}`)
                .attach('file', Buffer.from('test content'), 'test.txt')
                .expect(403);
        });
    });

    describe('/files (GET)', () => {
        it('should list files', () => {
            return request.default(app.getHttpServer())
                .get('/files')
                .set('Authorization', `Bearer ${teacherToken}`)
                .expect(200);
        });
    });

    describe('/files/:id (GET)', () => {
        it('should get file metadata', async () => {
            const file = await prisma.file.findFirst();
            if (file) {
                return request.default(app.getHttpServer())
                    .get(`/files/${file.id}`)
                    .set('Authorization', `Bearer ${teacherToken}`)
                    .expect(200);
            }
        });
    });

    describe('/files/:id/download (GET)', () => {
        it('should download file', async () => {
            const file = await prisma.file.findFirst();
            if (file) {
                return request.default(app.getHttpServer())
                    .get(`/files/${file.id}/download`)
                    .set('Authorization', `Bearer ${teacherToken}`)
                    .expect(200);
            }
        });
    });

    describe('/files/:id (DELETE)', () => {
        it('should delete file as teacher', async () => {
            const file = await prisma.file.findFirst();
            if (file) {
                return request.default(app.getHttpServer())
                    .delete(`/files/${file.id}`)
                    .set('Authorization', `Bearer ${teacherToken}`)
                    .expect(200);
            }
        });
    });
});
