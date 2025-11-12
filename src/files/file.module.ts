import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { LocalStorageService } from './local-storage.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

const STORAGE_SERVICE = 'STORAGE_SERVICE';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        ConfigModule,
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                dest: configService.get<string>('UPLOADS_DIR', './uploads'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [FileController],
    providers: [
        FileService,
        {
            provide: STORAGE_SERVICE,
            useClass: LocalStorageService,
        },
    ],
    exports: [FileService, STORAGE_SERVICE],
})
export class FileModule { }
