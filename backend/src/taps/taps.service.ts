import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {BASE_REGEN_INTERVAL} from '../shared/constants/constants';
import {LevelsService} from '../levels/levels.service';

@Injectable()
export class TapsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly levelsService: LevelsService
  ) {}

  async getTaps(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {id: userId},
    });
    if (!user) throw new NotFoundException('User not found');

    const now = new Date();
    const maxTaps = await this.levelsService.getMaxEnergy(user.level);
    let regenInterval = BASE_REGEN_INTERVAL; // 1200 секунд (20 минут)

    const activeBoost = await this.prismaService.activeBoost.findFirst({
      where: {
        userId,
        effectType: 'increaseRegen',
        expiresAt: {gt: now},
      },
    });

    if (activeBoost) regenInterval /= 2;

    const elapsedTime = Math.floor(
      (now.getTime() - user.lastTapRegen.getTime()) / 1000
    );


    const tapsToRegen = Math.floor((elapsedTime / regenInterval) * maxTaps);

    let newTaps = user.taps + tapsToRegen;
    if (newTaps > maxTaps) newTaps = maxTaps;

    const nextRegen = Math.ceil(regenInterval - (elapsedTime % regenInterval));


    const regenTimeUsed = Math.floor((tapsToRegen / maxTaps) * regenInterval);
    const newLastRegen = new Date(
      user.lastTapRegen.getTime() + regenTimeUsed * 1000
    );

    if (newTaps !== user.taps) {
      await this.prismaService.user.update({
        where: {id: userId},
        data: {taps: newTaps, lastTapRegen: newLastRegen},
      });
    }

    return {
      taps: newTaps,
      maxTaps,
      nextRegen,
      regenSpeed: activeBoost ? 'FAST' : 'NORMAL',
    };
  }

  async useTaps(userId: number, amount: number = 1) {
    const user = await this.prismaService.user.findUnique({
      where: {id: userId},
      include: {ActiveBoost: true},
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.taps < amount)
      throw new BadRequestException('Not enough taps available');

    const levelConfig = await this.prismaService.levelConfig.findFirst({
      where: {level: {lte: user.level}},
      orderBy: {level: 'desc'},
    });

    const tapCount = levelConfig?.tapCount ?? 1;
    const hasDoublePointsBoost = user.ActiveBoost.some(
      boost =>
        boost.effectType === 'doubleTapPoints' &&
        boost.expiresAt !== null &&
        boost.expiresAt.getTime() > Date.now()
    );

    let coinsEarned = amount * tapCount;
    if (hasDoublePointsBoost) coinsEarned *= 2;

    const updatedUser = await this.prismaService.user.update({
      where: {id: userId},
      data: {
        taps: Math.max(user.taps - amount, 0),
        balance: {increment: coinsEarned},
      },
      select: {taps: true, balance: true},
    });

    return {
      taps: updatedUser.taps,
      balance: updatedUser.balance,
      coinsEarned,
      message: `${amount} tap(s) used`,
    };
  }
}
