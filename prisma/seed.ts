import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Hash Passwords
  const saltRounds = 10;
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const teacherPassword = await bcrypt.hash('teacher123', saltRounds);
  const studentPassword = await bcrypt.hash('student123', saltRounds);

  // 2. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@finsh.com' },
    update: {},
    create: {
      email: 'admin@finsh.com',
      password: adminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'ADMIN',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@finsh.com' },
    update: {},
    create: {
      email: 'teacher@finsh.com',
      password: teacherPassword,
      firstName: 'Ms.',
      lastName: 'Smith',
      role: 'TEACHER',
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'student1@finsh.com' },
    update: {},
    create: {
      email: 'student1@finsh.com',
      password: studentPassword,
      firstName: 'Alice',
      lastName: 'Johnson',
      role: 'STUDENT',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@finsh.com' },
    update: {},
    create: {
      email: 'student2@finsh.com',
      password: studentPassword,
      firstName: 'Bob',
      lastName: 'Williams',
      role: 'STUDENT',
    },
  });

  console.log('Created sample users.');

  // 3. Create Courses
  const course1 = await prisma.course.upsert({
    where: { id: 'course-1' },
    update: {},
    create: {
      id: 'course-1',
      name: 'Introduction to Robotics',
      description: 'A beginner course on robotics and Arduino integration.',
      teacherId: teacher.id,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'course-2' },
    update: {},
    create: {
      id: 'course-2',
      name: 'Advanced Mathematics',
      description: 'Calculus and linear algebra for advanced students.',
      teacherId: teacher.id,
    },
  });

  console.log('Created sample courses.');

  // 4. Enroll Students
  await prisma.courseEnrollment.upsert({
    where: { studentId_courseId: { studentId: student1.id, courseId: course1.id } },
    update: {},
    create: { studentId: student1.id, courseId: course1.id },
  });

  await prisma.courseEnrollment.upsert({
    where: { studentId_courseId: { studentId: student2.id, courseId: course1.id } },
    update: {},
    create: { studentId: student2.id, courseId: course1.id },
  });

  console.log('Enrolled students in courses.');

  // 5. Create Sample Schedule
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.schedule.upsert({
    where: { id: 'schedule-1' },
    update: {},
    create: {
      id: 'schedule-1',
      courseId: course1.id,
      title: 'Robotics Lab Session',
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
      location: 'Room 301 (3D Classroom)',
    },
  });

  console.log('Created sample schedule.');

  // 6. Create Sample Conversation
  const conversation1 = await prisma.conversation.upsert({
    where: { id: 'conversation-1' },
    update: {},
    create: {
      id: 'conversation-1',
      participants: {
        connect: [{ id: teacher.id }, { id: student1.id }],
      },
    },
  });

  console.log('Created sample conversation.');

  // 7. Create Sample Messages
  await prisma.message.upsert({
    where: { id: 'message-1' },
    update: {},
    create: {
      id: 'message-1',
      conversationId: conversation1.id,
      senderId: teacher.id,
      content: 'Welcome to Robotics! I look forward to seeing you in the first lab session tomorrow.',
    },
  });

  await prisma.message.upsert({
    where: { id: 'message-2' },
    update: {},
    create: {
      id: 'message-2',
      conversationId: conversation1.id,
      senderId: student1.id,
      content: 'Thank you! I am excited to start.',
    },
  });

  console.log('Created sample messages.');

  // 8. Create Sample File
  const fs = require('fs');
  const path = require('path');

  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const demoFilePath = path.join(uploadsDir, 'demo.txt');
  fs.writeFileSync(demoFilePath, 'This is a demo file for testing uploads.');

  const sampleFile = await prisma.file.upsert({
    where: { id: 'file-1' },
    update: {},
    create: {
      id: 'file-1',
      originalName: 'demo.txt',
      path: 'uploads/demo.txt',
      size: fs.statSync(demoFilePath).size,
      uploaderId: teacher.id,
      courseId: course1.id,
      mimeType: 'text/plain',
    },
  });

  console.log('Created sample file.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
