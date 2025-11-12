import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { StorageService } from './storage.interface';

@Injectable()
export class LocalStorageService implements StorageService {
    constructor(private configService: ConfigService) { }

    async saveFile(file: any, subPath: string): Promise<string> {
        const uploadsDir = this.configService.get<string>('UPLOADS_DIR', './uploads');
        const fullPath = path.join(uploadsDir, subPath);

        // Ensure directory exists
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Move file to destination
        await fs.promises.rename(file.path, fullPath);

        return subPath;
    }

    async deleteFile(filePath: string): Promise<void> {
        const uploadsDir = this.configService.get<string>('UPLOADS_DIR', './uploads');
        const fullPath = path.join(uploadsDir, filePath);

        if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
        }
    }

    async getFileStream(filePath: string): Promise<NodeJS.ReadableStream> {
        const uploadsDir = this.configService.get<string>('UPLOADS_DIR', './uploads');
        const fullPath = path.join(uploadsDir, filePath);

        return fs.createReadStream(fullPath);
    }
}
