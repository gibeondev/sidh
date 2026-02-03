import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegistrationPeriodsService } from './registration-periods.service';
import { CreateRegistrationPeriodDto } from './dto/create-registration-period.dto';
import { UpdateRegistrationPeriodDto } from './dto/update-registration-period.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/registration-periods')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminRegistrationPeriodsController {
  constructor(
    private readonly registrationPeriodsService: RegistrationPeriodsService,
  ) {}

  @Get()
  async list() {
    return this.registrationPeriodsService.list();
  }

  @Post()
  async create(@Body() dto: CreateRegistrationPeriodDto) {
    return this.registrationPeriodsService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRegistrationPeriodDto,
  ) {
    return this.registrationPeriodsService.update(id, dto);
  }

  @Post(':id/open')
  async open(@Param('id') id: string) {
    return this.registrationPeriodsService.open(id);
  }

  @Post(':id/close')
  async close(@Param('id') id: string) {
    return this.registrationPeriodsService.close(id);
  }
}

