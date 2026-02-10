import { Body, Controller, Post } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { PreRegisterDto } from './dto/pre-register.dto';

@Controller('public/applications')
export class PublicApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('pre-register')
  async preRegister(@Body() dto: PreRegisterDto) {
    return this.applicationsService.preRegister(dto);
  }
}
