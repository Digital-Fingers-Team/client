import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) { }

    @Get()
    async findAll(@Req() req: Request & { user: { id: string } }) {
        return this.conversationsService.findAll(req.user.id);
    }

    @Post()
    async create(
        @Body() body: { participantIds: string[] },
        @Req() req: Request & { user: { id: string } },
    ) {
        return this.conversationsService.create(body.participantIds, req.user.id);
    }
}
