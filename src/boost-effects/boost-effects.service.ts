import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';

@Injectable()
export class BoostEffectsService {
  constructor(private readonly prismaService: PrismaService) {}

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

    // Применяем эффект буста
    switch (boost.effectType) {
      case 'resetTaps':
        // Эффект: мгновенно устанавливаем энергию равной maxTaps и сбрасываем таймер восстановления
        await this.prismaService.user.update({
          where: {id: userId},
          data: {
            taps: user.maxTaps,
            lastTapRegen: new Date(),
          },
        });
        break;

      case 'doubleTapPoints':
        // Эффект: активируем удвоение очков за тап.
        // Создаем запись в таблице ActiveBoost с длительностью, указанной в effectValue (по умолчанию 5 минут)
        const durationMinutes = boost.effectValue ?? 5;
        await this.prismaService.activeBoost.create({
          data: {
            userId,
            effectType: 'doubleTapPoints',
            expiresAt: new Date(Date.now() + durationMinutes * 60 * 1000),
          },
        });
        break;

      case 'increaseRegen':
        // Эффект: ускоряем восстановление, отматывая время lastTapRegen назад на effectValue минут (по умолчанию 30)
        const adjustment = (boost.effectValue ?? 30) * 60 * 1000;
        const newRegen = new Date(user.lastTapRegen.getTime() - adjustment);
        await this.prismaService.user.update({
          where: {id: userId},
          data: {lastTapRegen: newRegen},
        });
        break;

      default:
        throw new BadRequestException('Unsupported boost effect type');
    }

    return {message: `Boost '${boost.title}' applied successfully`};
  }
}
