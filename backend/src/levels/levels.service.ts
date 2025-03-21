import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';

@Injectable()
export class LevelsService {
  constructor(private readonly prisma: PrismaService) {}

  async addXP(userId: number, xpToAdd: number) {
    const user = await this.prisma.user.findUnique({where: {id: userId}});
    if (!user) throw new NotFoundException('User not found');

    let newXP = user.xp + xpToAdd;
    let newLevel = user.level;
    let requiredXP = this.calculateRequiredXP(newLevel);

    while (newXP >= requiredXP) {
      newXP -= requiredXP;
      newLevel++;
      requiredXP = this.calculateRequiredXP(newLevel);
    }

    // Получаем максимальную энергию (maxTaps) из LevelConfig или по формуле
    const newMaxTaps = await this.getMaxEnergy(newLevel);

    await this.prisma.user.update({
      where: {id: userId},
      data: {xp: newXP, level: newLevel, maxTaps: newMaxTaps},
    });

    return {
      level: newLevel,
      xp: newXP,
      xpToNextLevel: requiredXP,
      maxTaps: newMaxTaps,
    };
  }

  // Рекурсивная функция для расчёта требуемого XP для следующего уровня
  //TODO: логи слующая, берез кол-во XP от предыдущего уровня
  // (500xp - первый уровновень) * новый.уровень * 500
  calculateRequiredXP(level: number): number {
    if (level === 1) return 500;
    return this.calculateRequiredXP(level - 1) + level * 500;
  }

  async getMaxEnergy(level: number): Promise<number> {
    // Если в таблице LevelConfig есть конкретное значение, возвращаем его, иначе используем формулу
    const config = await this.prisma.levelConfig.findUnique({where: {level}});
    // return config ? config.maxEnergy : 100 + 10 * Math.floor(level / 5);
    if (config) return config.maxEnergy;
    // Для уровня 1 по умолчанию возвращаем 500,
    // а для остальных уровней возвращаем 500 + (level - 1) * 10
    if (level === 1) return 500;
    return 500 + (level - 1) * 10;
  }

  async resetXP(userId: number) {
    await this.prisma.user.update({
      where: {id: userId},
      data: {xp: 0, level: 1, maxTaps: 50},
    });
    return {message: 'XP and level reset'};
  }

  async getUserLevel(userId: number) {
    const user = await this.prisma.user.findUnique({where: {id: userId}});
    if (!user) throw new NotFoundException('User not found');

    const requiredXP = this.calculateRequiredXP(user.level);

    // Ищем запись LevelConfig для текущего уровня или ближайшего ниже
    const levelConfig = await this.prisma.levelConfig.findFirst({
      where: {level: {lte: user.level}}, // lte - ищем уровень <= текущего
      orderBy: {level: 'desc'}, // Берем максимальный из возможных
    });

    return {
      level: user.level,
      xp: user.xp,
      xpToNextLevel: requiredXP,
      maxTaps: user.maxTaps,
      tapCount: levelConfig ? levelConfig.tapCount : 1, // По умолчанию 1, если вообще записей нет
    };
  }
}
