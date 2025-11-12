import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Query,
    UseInterceptors,
    UploadedFile,
    Res,
    Req,
    UseGuards,
    ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import type { Response as ExpressResponse } from 'express';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.decorator';

@Controller('files')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FileController {
    constructor(private readonly fileService: FileService) { }

    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request & { user: { id: string; role: Role } },
        @Query('courseId') courseId?: string,
    ) {
        if (!file) {
            throw new ForbiddenException('No file uploaded');
        }

        return this.fileService.uploadFile(file, req.user.id, courseId, req.user.role);
    }

    @Post('uploads')
    @UseInterceptors(FileInterceptor('file'))
    async uploadMessageFile(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request & { user: { id: string; role: Role } },
    ) {
        if (!file) {
            throw new ForbiddenException('No file uploaded');
        }

        return this.fileService.uploadFile(file, req.user.id, undefined, req.user.role);
    }

    @Get(':id/download')
    async downloadFile(@Param('id') id: string, @Res() res: ExpressResponse) {
        const { file, stream } = await this.fileService.downloadFile(id);

        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);

        stream.pipe(res);
    }

    @Get(':id')
    async getFile(@Param('id') id: string) {
        return this.fileService.getFile(id);
    }

    @Get()
    async listFiles(
        @Query('courseId') courseId?: string,
        @Query('uploaderId') uploaderId?: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ) {
        const filters = {
            courseId,
            uploaderId,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
        };

        return this.fileService.listFiles(filters);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    async deleteFile(
        @Param('id') id: string,
        @Req() req: Request & { user: { id: string; role: Role } },
    ) {
        return this.fileService.deleteFile(id, req.user.id, req.user.role);
    }
}
