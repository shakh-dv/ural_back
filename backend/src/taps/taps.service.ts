import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {regenInterval} from '../shared/constants/constants';

@Injectable()
export class TapsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTaps(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {id: userId},
    });
    if (!user) throw new NotFoundException('User not found');

    const now = new Date();

    // восстанавливаем тапы каждые 20 минут.
    const interval = regenInterval;

    const elapsedTime = Math.floor(
      (now.getTime() - user.lastTapRegen.getTime()) / 1000
    );
    const tapsToRegen = Math.floor(elapsedTime / interval) * 500;

    let newTaps = user.taps + tapsToRegen;
    if (newTaps > user.maxTaps) newTaps = user.maxTaps;

    // Обновляем данные пользователя
    await this.prismaService.user.update({
      where: {id: userId},
      data: {taps: newTaps, lastTapRegen: now},
    });

    return {
      taps: newTaps,
      maxTaps: user.maxTaps,
      nextRegen: regenInterval - (elapsedTime % regenInterval),
      energyIncrement: 500,
    };
  }

  async useTaps(userId: number, amount: number = 1) {
    const user = await this.prismaService.user.findUnique({
      where: {id: userId},
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.taps < amount) {
      throw new BadRequestException('Not enough taps available');
    }
    const newTaps = user.taps - amount;
    await this.prismaService.user.update({
      where: {id: userId},
      data: {taps: newTaps},
    });
    return {taps: newTaps, message: `${amount} tap(s) used`};
  }

  // async boostTaps(
  //   userId: number,
  //   boostData: {speedUp: number; duration: number}
  // ) {
  //   const user = await this.prismaService.user.findUnique({
  //     where: {id: userId},
  //   });
  //   if (!user) throw new NotFoundException('User not found');
  //
  //   // Пример: уменьшаем lastTapRegen на boostData.speedUp минут
  //   const boostedRegen = new Date(
  //     user.lastTapRegen.getTime() - boostData.speedUp * 60 * 1000
  //   );
  //   await this.prismaService.user.update({
  //     where: {id: userId},
  //     data: {lastTapRegen: boostedRegen},
  //   });
  //
  //   await this.prismaService.boost.create({
  //     data: {
  //       userId,
  //       speedUp: boostData.speedUp,
  //       duration: boostData.duration,
  //     },
  //   });
  //
  //   return {message: 'Boost applied'};
  // }

  // async claimTapBonus(userId: number) {
  //   const user = await this.prismaService.user.findUnique({
  //     where: {id: userId},
  //   });
  //   if (!user) throw new NotFoundException('User not found');
  //
  //   const today = new Date().toISOString().split('T')[0];
  //   const usedBonuses = await this.prismaService.userBonus.count({
  //     where: {userId, date: today},
  //   });
  //
  //   if (usedBonuses >= 3) {
  //     throw new BadRequestException('Daily bonus limit reached');
  //   }
  //
  //   let newTaps = user.taps + 50;
  //   if (newTaps > user.maxTaps) newTaps = user.maxTaps;
  //
  //   await this.prismaService.user.update({
  //     where: {id: userId},
  //     data: {taps: newTaps},
  //   });
  //
  //   await this.prismaService.userBonus.create({
  //     data: {userId, date: today},
  //   });
  //
  //   return {taps: newTaps, message: 'Bonus applied'};
  // }
}
