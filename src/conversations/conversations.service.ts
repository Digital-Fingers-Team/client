import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationsService {
    constructor(private prisma: PrismaService) { }

    async findAll(userId: string) {
        return this.prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        id: userId,
                    },
                },
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
                messages: {
                    take: 1,
                    orderBy: {
                        sentAt: 'desc',
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
    }

    async create(participantIds: string[], creatorId: string) {
        // Ensure creator is included
        if (!participantIds.includes(creatorId)) {
            participantIds.push(creatorId);
        }

        return this.prisma.conversation.create({
            data: {
                participants: {
                    connect: participantIds.map(id => ({ id })),
                },
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
            },
        });
    }
}
