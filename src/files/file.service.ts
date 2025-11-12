import { Injectable, ForbiddenException, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../auth/roles.decorator';

const STORAGE_SERVICE = 'STORAGE_SERVICE';

@Injectable()
export class FileService {
    constructor(
        private prisma: PrismaService,
        @Inject(STORAGE_SERVICE) private storageService: any,
    ) { }

    async uploadFile(
        file: any,
        uploaderId: string,
        courseId?: string,
        uploaderRole?: Role,
    ) {
        // Validate permissions
        if (uploaderRole !== Role.ADMIN && uploaderRole !== Role.TEACHER) {
            throw new ForbiddenException('Only admins and teachers can upload files');
        }

        // Validate file size (20MB max)
        const maxSize = 20 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new ForbiddenException('File size exceeds 20MB limit');
        }

        // Validate file type
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif',
            'application/pdf',
            'text/plain',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new ForbiddenException('File type not allowed');
        }

        // Generate safe path
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 15);
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const subPath = `${year}/${month}/${random}-${sanitizedName}`;

        // Save file
        const savedPath = await this.storageService.saveFile(file, subPath);

        // Save to DB
        const fileRecord = await this.prisma.file.create({
            data: {
                originalName: file.originalname,
                path: savedPath,
                size: file.size,
                uploaderId,
                courseId,
                mimeType: file.mimetype,
            },
        });

        return fileRecord;
    }

    async getFile(id: string) {
        const file = await this.prisma.file.findUnique({
            where: { id },
            include: { uploader: true, course: true },
        });

        if (!file) {
            throw new NotFoundException('File not found');
        }

        return file;
    }

    async downloadFile(id: string) {
        const file = await this.getFile(id);
        const stream = await this.storageService.getFileStream(file.path);

        return { file, stream };
    }

    async listFiles(filters: { courseId?: string; uploaderId?: string; limit?: number; offset?: number }) {
        const { courseId, uploaderId, limit = 10, offset = 0 } = filters;

        const where: any = {};
        if (courseId) where.courseId = courseId;
        if (uploaderId) where.uploaderId = uploaderId;

        const files = await this.prisma.file.findMany({
            where,
            include: { uploader: true, course: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        const total = await this.prisma.file.count({ where });

        return { files, total };
    }

    async deleteFile(id: string, userId: string, userRole: Role) {
        const file = await this.getFile(id);

        // Check permissions
        if (userRole !== Role.ADMIN && file.uploaderId !== userId) {
            throw new ForbiddenException('You can only delete your own files');
        }

        // Delete from storage
        await this.storageService.deleteFile(file.path);

        // Delete from DB
        await this.prisma.file.delete({ where: { id } });

        return { message: 'File deleted successfully' };
    }
}
