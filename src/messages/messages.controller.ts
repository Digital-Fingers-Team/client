import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessagesService } from './messages.service';

@Controller('conversations/:conversationId/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Get()
    async findByConversation(
        @Param('conversationId') conversationId: string,
        @Req() req: Request & { user: { id: string } },
    ) {
        return this.messagesService.findByConversation(conversationId, req.user.id);
    }

    @Post()
    async create(
        @Param('conversationId') conversationId: string,
        @Body() body: { content: string; fileId?: string },
        @Req() req: Request & { user: { id: string } },
    ) {
        return this.messagesService.create(conversationId, req.user.id, body.content, body.fileId);
    }
}
