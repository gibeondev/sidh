import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminStudentsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  async list() {
    return this.applicationsService.adminListStudents();
  }

  @Get('filter-options')
  async filterOptions() {
    return this.applicationsService.adminStudentExportFilterOptions();
  }

  @Get('export')
  async exportCsv(
    @Query('grade') grade?: string,
    @Query('country') country?: string,
    @Query('occupation') occupation?: string,
    @Res({ passthrough: false }) res?: Response,
  ) {
    const csv = await this.applicationsService.adminGetStudentsExportCsv({
      grade,
      country,
      occupation,
    });
    res!.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res!.setHeader('Content-Disposition', 'attachment; filename="daftar-siswa.csv"');
    res!.send(csv);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.applicationsService.adminGetStudentById(id);
  }
}
