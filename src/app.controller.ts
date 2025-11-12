import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  serveIndex(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'index.html'));
  }

  @Get('admin-dashboard.html')
  serveAdminDashboard(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'admin-dashboard.html'));
  }

  @Get('student-dashboard.html')
  serveStudentDashboard(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'student-dashboard.html'));
  }

  @Get('teacher-dashboard.html')
  serveTeacherDashboard(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'teacher-dashboard.html'));
  }

  @Get('index.html')
  serveIndexPage(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'index.html'));
  }

  @Get('admin-users.html')
  serveAdminUsers(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'admin-users.html'));
  }

  @Get('admin-reports.html')
  serveAdminReports(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'admin-reports.html'));
  }

  @Get('admin-schedule.html')
  serveAdminSchedule(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'admin-schedule.html'));
  }

  @Get('admin-settings.html')
  serveAdminSettings(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'admin-settings.html'));
  }

  @Get('admin-messages.html')
  serveAdminMessages(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'admin-messages.html'));
  }

  @Get('admin-prep-review.html')
  serveAdminPrepReview(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'admin-prep-review.html'));
  }

  @Get('student-courses.html')
  serveStudentCourses(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'student-courses.html'));
  }

  @Get('student-progress.html')
  serveStudentProgress(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'student-progress.html'));
  }

  @Get('student-schedule.html')
  serveStudentSchedule(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'student-schedule.html'));
  }

  @Get('student-settings.html')
  serveStudentSettings(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'student-settings.html'));
  }

  @Get('student-messages.html')
  serveStudentMessages(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'student-messages.html'));
  }

  @Get('teacher-courses.html')
  serveTeacherCourses(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'teacher-courses.html'));
  }

  @Get('teacher-progress.html')
  serveTeacherProgress(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'teacher-progress.html'));
  }

  @Get('teacher-schedule.html')
  serveTeacherSchedule(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'teacher-schedule.html'));
  }

  @Get('teacher-settings.html')
  serveTeacherSettings(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'teacher-settings.html'));
  }

  @Get('teacher-messages.html')
  serveTeacherMessages(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'teacher-messages.html'));
  }

  @Get('classroom.html')
  serveClassroom(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'classroom.html'));
  }
}
