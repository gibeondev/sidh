import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  // Commented out for now - database connection not needed during bootstrap
  // async onModuleInit() {
  //   await this.$connect();
  // }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
