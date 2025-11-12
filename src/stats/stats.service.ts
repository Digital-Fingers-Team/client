import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    async getOverview() {
        const [userCount, courseCount, enrollmentCount, messageCount] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.course.count(),
            this.prisma.courseEnrollment.count(),
            this.prisma.message.count(),
        ]);

        return {
            users: userCount,
            courses: courseCount,
            enrollments: enrollmentCount,
            messages: messageCount,
        };
    }

    async getEngagement() {
        const now = new Date();
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const [recentMessages, activeUsers] = await Promise.all([
            this.prisma.message.count({
                where: {
                    sentAt: {
                        gte: lastWeek,
                    },
                },
            }),
            this.prisma.user.count({
                where: {
                    sentMessages: {
                        some: {
                            sentAt: {
                                gte: lastWeek,
                            },
                        },
                    },
                },
            }),
        ]);

        return {
            recentMessages,
            activeUsers,
        };
    }
}
