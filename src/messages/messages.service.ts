import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) { }

    async findByConversation(conversationId: string, userId: string) {
        // Verify user is participant in conversation
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id: conversationId,
                participants: {
                    some: {
                        id: userId,
                    },
                },
            },
        });

        if (!conversation) {
            throw new Error('Conversation not found or access denied');
        }

        return this.prisma.message.findMany({
            where: {
                conversationId,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                file: {
                    select: {
                        id: true,
                        originalName: true,
                        size: true,
                        mimeType: true,
                    },
                },
            },
            orderBy: {
                sentAt: 'asc',
            },
        });
    }

    async create(conversationId: string, senderId: string, content: string, fileId?: string) {
        // Verify user is participant in conversation
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id: conversationId,
                participants: {
                    some: {
                        id: senderId,
                    },
                },
            },
        });

        if (!conversation) {
            throw new Error('Conversation not found or access denied');
        }

        const message = await this.prisma.message.create({
            data: {
                conversationId,
                senderId,
                content,
                fileId,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                file: {
                    select: {
                        id: true,
                        originalName: true,
                        size: true,
                        mimeType: true,
                    },
                },
            },
        });

        // Update conversation updatedAt
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });

        return message;
    }
}
