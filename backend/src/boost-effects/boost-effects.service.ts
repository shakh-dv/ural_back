import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {Cron, CronExpression} from '@nestjs/schedule';

@Injectable()
export class BoostEffectsService {
  private readonly logger = new Logger(BoostEffectsService.name);
  constructor(private readonly prismaService: PrismaService) {}

  private async cleanupExpiredBoostsGlobally(): Promise<void> {
    const {count} = await this.prismaService.activeBoost.deleteMany({
      where: {expiresAt: {lt: new Date()}},
    });
    if (count > 0) {
      this.logger.log(`Cleaned up ${count} expired boosts.`);
    }
  }

  // Cron-job, который запускается каждые 5 минут
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCronCleanup() {
    await this.cleanupExpiredBoostsGlobally();
  }

  async applyBoostEffect(userId: number, boostItemId: number) {
    const boost = await this.prismaService.boostItem.findUnique({
      where: {id: boostItemId},
    });
    if (!boost) throw new NotFoundException('Boost item not found');

    const user = await this.prismaService.user.findUnique({
      where: {id: userId},
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.balance < boost.cost) {
      throw new BadRequestException('Not enough points to purchase this boost');
    }

    await this.prismaService.user.update({
      where: {id: userId},
      data: {balance: {decrement: boost.cost}},
    });

    switch (boost.effectType) {
      case 'resetTaps':
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const usageCount = await this.prismaService.activeBoost.count({
          where: {
            userId,
            effectType: 'resetTaps',
            createdAt: {gte: today},
          },
        });

        if (usageCount >= 6) {
          throw new BadRequestException(
            'Daily limit for resetTaps reached (6 times)'
          );
        }

        // Мгновенно восстанавливаем энергию и сбрасываем таймер
        await this.prismaService.user.update({
          where: {id: userId},
          data: {
            taps: user.maxTaps,
            lastTapRegen: new Date(),
          },
        });

        await this.prismaService.activeBoost.create({
          data: {
            userId,
            effectType: 'resetTaps',
            createdAt: new Date(),
          },
        });
        break;

      case 'doubleTapPoints':
        // Проверяем, есть ли уже активный boost
        const existingBoost = await this.prismaService.activeBoost.findFirst({
          where: {
            userId,
            effectType: 'doubleTapPoints',
            expiresAt: {gt: new Date()}, // Буст ещё не истёк
          },
        });

        if (existingBoost) {
          throw new BadRequestException('Boost is already active'); // Ошибка для фронта
        }

        // Если буста нет — создаем новый
        const durationMinutes = boost.effectValue ?? 4;
        await this.prismaService.activeBoost.create({
          data: {
            userId,
            effectType: 'doubleTapPoints',
            expiresAt: new Date(Date.now() + durationMinutes * 60 * 1000),
          },
        });
        break;

      case 'increaseRegen':
        // Ускоряем восстановление, если буст ещё не активен
        const activeRegenBoost = await this.prismaService.activeBoost.findFirst(
          {
            where: {
              userId,
              effectType: 'increaseRegen',
              expiresAt: {gt: new Date()},
            },
          }
        );

        if (activeRegenBoost) {
          throw new BadRequestException('Regeneration boost is already active');
        }

        const regenDuration = boost.effectValue ?? 10; // минут
        await this.prismaService.activeBoost.create({
          data: {
            userId,
            effectType: 'increaseRegen',
            expiresAt: new Date(Date.now() + regenDuration * 60 * 1000),
          },
        });
        break;

      default:
        throw new BadRequestException('Unsupported boost effect type');
    }

    return {message: `Boost '${boost.title}' applied successfully`};
  }
}
