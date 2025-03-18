import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {LevelConfig} from '@prisma/client';

@Injectable()
export class LevelConfigService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(): Promise<LevelConfig[]> {
    return this.prismaService.levelConfig.findMany();
  }

  async getOne(level: number): Promise<LevelConfig> {
    const config = await this.prismaService.levelConfig.findUnique({
      where: {level},
    });
    if (!config) {
      throw new NotFoundException(`Level config for level ${level} not found`);
    }
    return config;
  }

  async create(data: {
    level: number;
    maxEnergy: number;
    tapCount: number;
  }): Promise<LevelConfig> {
    return this.prismaService.levelConfig.create({data});
  }

  async update(
    level: number,
    data: {maxEnergy: number; tapCount: number}
  ): Promise<LevelConfig> {
    // Проверяем наличие записи
    await this.getOne(level);
    return this.prismaService.levelConfig.update({where: {level}, data});
  }

  async delete(level: number): Promise<LevelConfig> {
    // Проверяем наличие записи
    await this.getOne(level);
    return this.prismaService.levelConfig.delete({where: {level}});
  }
}
