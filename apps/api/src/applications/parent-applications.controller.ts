import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { UpdateFullRegistrationDto } from './dto/update-full-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('parent/applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PARENT', 'ADMIN')
export class ParentApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  async list(@Request() req: any) {
    const parentUserId = req.user.sub;
    const role = req.user.role;
    return this.applicationsService.listByParent(parentUserId, role);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Request() req: any) {
    const parentUserId = req.user.sub;
    const parentEmail = req.user.email;
    const role = req.user.role;
    return this.applicationsService.getOneByParent(id, parentUserId, parentEmail, role);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFullRegistrationDto,
    @Request() req: any,
  ) {
    const parentUserId = req.user.sub;
    const parentEmail = req.user.email;
    const role = req.user.role;
    return this.applicationsService.parentUpdateFullRegistration(
      id,
      parentUserId,
      parentEmail,
      role,
      dto,
    );
  }
}
