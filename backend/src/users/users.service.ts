import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {GetUserByIdResultDTO} from './dtos/get-user-by-id.dto';
import {GetAllUsersResultDTO} from './dtos/get-all-users.dto';
import {UpdateUserDTO} from './dtos/update-user-dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOrCreate(data: any) {
    const {id, username, first_name, photo_url} = data;
    let user = await this.prismaService.user.findUnique({
      where: {telegramId: BigInt(id)},
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          telegramId: BigInt(id),
          username: username || '',
          firstName: first_name,
          avatar: photo_url || '',
        },
      });
    }

    return user;
  }

  getAll(): Promise<GetAllUsersResultDTO> {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        avatar: true,
        firstName: true,
        telegramId: true,
        xp: true,
        level: true,
        maxTaps: true,
        taps: true,
        balance: true,
        lastTapRegen: true,
        referralCode: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {createdAt: 'desc'},
    });
  }

  async getById(userId: number): Promise<GetUserByIdResultDTO> {
    const user = await this.prismaService.user.findFirst({
      where: {id: userId},
      select: {
        id: true,
        username: true,
        firstName: true,
        telegramId: true,
        avatar: true,
        xp: true,
        level: true,
        maxTaps: true,
        taps: true,
        lastTapRegen: true,
        balance: true,
        referralCode: true,
        ActiveBoost: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async update(
    userId: number,
    data: UpdateUserDTO
  ): Promise<GetUserByIdResultDTO> {
    const user = await this.prismaService.user.findUnique({
      where: {id: userId},
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prismaService.user.update({
      where: {id: userId},
      data: {
        balance: {increment: data.balance},
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        avatar: true,
        referralCode: true,
        telegramId: true,
        xp: true,
        level: true,
        maxTaps: true,
        taps: true,
        lastTapRegen: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
