import { SetMetadata } from '@nestjs/common';
export enum Role {
    ADMIN = 'ADMIN',
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT',
}

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);