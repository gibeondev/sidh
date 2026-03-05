import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApplicationStatus } from '@prisma/client';
import { ApplicationsService } from './applications.service';
import { DecisionNoteDto } from './dto/decision.dto';
import { InternalNoteDto } from './dto/internal-note.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
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

  @Get('export')
  async exportCsv(
    @Res() res: Response,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('program') program?: string,
    @Query('country') country?: string,
  ) {
    const statusEnum = status && this.isApplicationStatus(status) ? (status as ApplicationStatus) : undefined;
    const csv = await this.applicationsService.adminExportFullRegistrations({
      status: statusEnum,
      search,
      program: program || undefined,
      country: country || undefined,
    });
    
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `full-registrations-${timestamp}.csv`;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8 compatibility
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
    @Query('hasFullRegistration') hasFullRegistration?: string,
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
      hasFullRegistration: hasFullRegistration === 'true' || hasFullRegistration === '1',
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.applicationsService.adminGetById(id);
  }

  @Post(':id/approve')
  async approve(
    @Param('id') id: string,
    @Query('statusType') statusType?: string,
  ) {
    const type = statusType === 'preRegistration' ? 'preRegistration' : 'fullRegistration';
    return this.applicationsService.adminApprove(id, type);
  }

  @Post(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body() dto: DecisionNoteDto,
    @Query('statusType') statusType?: string,
  ) {
    if (statusType === 'preRegistration' || statusType === 'fullRegistration') {
      dto.statusType = statusType;
    }
    return this.applicationsService.adminReject(id, dto);
  }

  @Post(':id/request-changes')
  async requestChanges(
    @Param('id') id: string,
    @Body() dto: DecisionNoteDto,
    @Query('statusType') statusType?: string,
  ) {
    if (statusType === 'preRegistration' || statusType === 'fullRegistration') {
      dto.statusType = statusType;
    }
    return this.applicationsService.adminRequestChanges(id, dto);
  }

  @Patch(':id/internal-note')
  async updateInternalNote(@Param('id') id: string, @Body() dto: InternalNoteDto) {
    return this.applicationsService.adminUpdateInternalNote(id, dto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @Query('statusType') statusType?: string,
  ) {
    if (statusType === 'preRegistration' || statusType === 'fullRegistration') {
      dto.statusType = statusType;
    }
    return this.applicationsService.adminUpdateStatus(id, dto);
  }

  private isApplicationStatus(s: string): boolean {
    return ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED'].includes(s);
  }
}
