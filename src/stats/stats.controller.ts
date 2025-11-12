import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.decorator';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('overview')
    async getOverview() {
        return this.statsService.getOverview();
    }

    @Get('engagement')
    async getEngagement() {
        return this.statsService.getEngagement();
    }
}
