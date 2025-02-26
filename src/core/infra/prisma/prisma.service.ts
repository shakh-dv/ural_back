import {Injectable, OnModuleInit} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    if (process.env.NODE_ENV !== 'production') {
      super({
        log: ['info'],
      });
    } else {
      super();
    }
  }

  async onModuleInit() {
    await this.$connect();
  }
}
