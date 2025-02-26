import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {UsersService} from '../users/users.service';

@Injectable()
export class ReferralsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService
  ) {}

  async handleReferral(referralCode: string, inviteeTelegramId: number) {
    const inviter = await this.prismaService.user.findUnique({
      where: {referralCode},
    });

    if (!inviter) {
      throw new BadRequestException('Invalid referral code');
    }

    const invitee = await this.prismaService.user.findUnique({
      where: {telegramId: inviteeTelegramId},
    });

    if (!invitee) {
      throw new NotFoundException('Invitee not found');
    }

    if (inviter.id === invitee.id) {
      throw new BadRequestException('User cannot refer themselves');
    }

    const existingReferral = await this.prismaService.referral.findFirst({
      where: {
        inviterId: inviter.id,
        inviteeId: invitee.id,
      },
    });

    if (existingReferral) {
      throw new BadRequestException('Referral already exists');
    }

    await this.prismaService.referral.create({
      data: {
        inviterId: inviter.id,
        inviteeId: invitee.id,
      },
    });
  }

  async getReferralsByUser(userId: number) {
    return this.prismaService.referral.findMany({
      where: {
        inviterId: userId,
      },
      select: {
        id: true,
        inviterId: true,
        inviteeId: true,
        invitee: {
          select: {
            id: true,
            firstName: true,
          },
        },
        rewardEarned: true,
        status: false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async generateReferralLink(id: number) {
    const user = await this.userService.getById(id);
    return {
      link: `https://t.me/uraltap_bot?startapp=${user.referralCode}`,
    };
  }

  //TODO: добавить условие для получения бонуса
  async rewardInviter(referralId: number) {
    const referral = await this.prismaService.referral.findUnique({
      where: {id: referralId},
      include: {inviter: true, invitee: true},
    });

    if (!referral) {
      throw new NotFoundException('Referral not found');
    }
    if (referral.rewardEarned > 0) {
      throw new BadRequestException('Reward already claimed');
    }

    if (!referral.invitee || referral.invitee.xp < 100) {
      throw new BadRequestException(
        'Invitee must earn at least 100 XP to grant bonus'
      );
    }

    const rewardAmount = 250;
    await this.prismaService.user.update({
      where: {id: referral.inviterId},
      data: {balance: {increment: rewardAmount}},
    });

    return this.prismaService.referral.update({
      where: {id: referral.id},
      data: {rewardEarned: rewardAmount, status: 'approved'},
    });
  }
}
