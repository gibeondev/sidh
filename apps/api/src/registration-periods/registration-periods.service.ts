import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrationPeriodStatus } from '@prisma/client';
import { CreateRegistrationPeriodDto } from './dto/create-registration-period.dto';
import { UpdateRegistrationPeriodDto } from './dto/update-registration-period.dto';

@Injectable()
export class RegistrationPeriodsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActive() {
    const now = new Date();
    return this.prisma.registrationPeriod.findFirst({
      where: {
        status: RegistrationPeriodStatus.OPEN,
        startAt: { lte: now },
        endAt: { gt: now },
      },
      orderBy: [
        { startAt: 'desc' },
        { createdAt: 'desc' },
        { id: 'desc' },
      ],
    });
  }

  async list() {
    return this.prisma.registrationPeriod.findMany({
      orderBy: { startAt: 'desc' },
    });
  }

  async create(dto: CreateRegistrationPeriodDto) {
    return this.prisma.registrationPeriod.create({
      data: {
        name: dto.name,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        status: RegistrationPeriodStatus.CLOSED,
      },
    });
  }

  async update(id: string, dto: UpdateRegistrationPeriodDto) {
    await this.ensureExists(id);
    return this.prisma.registrationPeriod.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.startAt !== undefined && { startAt: new Date(dto.startAt) }),
        ...(dto.endAt !== undefined && { endAt: new Date(dto.endAt) }),
      },
    });
  }

  async open(id: string) {
    await this.ensureExists(id);
    await this.prisma.$transaction(async (tx) => {
      await tx.registrationPeriod.updateMany({
        where: { status: RegistrationPeriodStatus.OPEN },
        data: { status: RegistrationPeriodStatus.CLOSED },
      });
      await tx.registrationPeriod.update({
        where: { id },
        data: { status: RegistrationPeriodStatus.OPEN },
      });
    });

    return this.prisma.registrationPeriod.findUniqueOrThrow({ where: { id } });
  }

  async close(id: string) {
    await this.ensureExists(id);
    return this.prisma.registrationPeriod.update({
      where: { id },
      data: { status: RegistrationPeriodStatus.CLOSED },
    });
  }

  private async ensureExists(id: string) {
    const existing = await this.prisma.registrationPeriod.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Registration period not found');
    }
  }
}

