import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { ApplicationsService } from './applications.service';
import { DecisionNoteDto } from './dto/decision.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('filter-options')
  async filterOptions() {
    return this.applicationsService.adminListFilterOptions();
  }

  @Get()
  async list(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('program') program?: string,
    @Query('country') country?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    const statusEnum = status && this.isApplicationStatus(status) ? (status as ApplicationStatus) : undefined;
    const order = sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined;
    return this.applicationsService.adminList({
      status: statusEnum,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      program: program || undefined,
      country: country || undefined,
      sortBy: sortBy || undefined,
      sortOrder: order,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.applicationsService.adminGetById(id);
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string) {
    return this.applicationsService.adminApprove(id);
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string, @Body() dto: DecisionNoteDto) {
    return this.applicationsService.adminReject(id, dto);
  }

  @Post(':id/request-changes')
  async requestChanges(@Param('id') id: string, @Body() dto: DecisionNoteDto) {
    return this.applicationsService.adminRequestChanges(id, dto);
  }

  private isApplicationStatus(s: string): boolean {
    return ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED'].includes(s);
  }
}
