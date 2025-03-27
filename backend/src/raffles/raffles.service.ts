import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {CreateRaffleDTO} from './dto/create-raffle.dto';
import {UpdateRaffleDTO} from './dto/update-raffle.dto';

@Injectable()
export class RafflesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRaffle(data: CreateRaffleDTO) {
    return this.prisma.raffle.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        endDate: data.endDate,
        imageId: data.imageId, // добавлено поле imageId
      },
    });
  }

  async getAllRaffles() {
    const raffles = await this.prisma.raffle.findMany({
      include: {image: true},
    });

    return raffles.map(raffle => ({
      ...raffle,
      image: raffle.image
        ? {
            id: raffle.image.id,
            filename: raffle.image.filename,
            url: process.env.IMAGE_URL + raffle.image.filename,
            xsFilename: raffle.image.xsFilename,
            xsUrl: raffle.image.xsFilename
              ? process.env.IMAGE_URL + raffle.image.xsFilename
              : null,
            mdFilename: raffle.image.mdFilename,
            mdUrl: raffle.image.mdFilename
              ? process.env.IMAGE_URL + raffle.image.mdFilename
              : null,
          }
        : null,
    }));
  }

  async getRaffleById(id: number) {
    const raffle = await this.prisma.raffle.findUnique({
      where: {id},
      include: {image: true},
    });
    if (!raffle) throw new NotFoundException('Розыгрыш не найден');

    return {
      ...raffle,
      image: raffle.image
        ? {
            id: raffle.image.id,
            filename: raffle.image.filename,
            url: process.env.IMAGE_URL + raffle.image.filename,
            xsFilename: raffle.image.xsFilename,
            xsUrl: raffle.image.xsFilename
              ? process.env.IMAGE_URL + raffle.image.xsFilename
              : null,
            mdFilename: raffle.image.mdFilename,
            mdUrl: raffle.image.mdFilename
              ? process.env.IMAGE_URL + raffle.image.mdFilename
              : null,
          }
        : null,
    };
  }

  async updateRaffle(id: number, data: UpdateRaffleDTO) {
    // Проверяем наличие розыгрыша
    await this.getRaffleById(id);
    return this.prisma.raffle.update({
      where: {id},
      data: data,
    });
  }

  async deleteRaffle(id: number) {
    await this.getRaffleById(id);
    return this.prisma.raffle.delete({where: {id}});
  }

  async joinRaffle(userId: number, raffleId: number) {
    const user = await this.prisma.user.findUnique({where: {id: userId}});
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const raffle = await this.prisma.raffle.findUnique({where: {id: raffleId}});
    if (!raffle || raffle.status !== 'ACTIVE' || new Date() > raffle.endDate) {
      throw new BadRequestException('Розыгрыш неактивен или завершен');
    }

    if (user.balance < raffle.price) {
      throw new BadRequestException('Недостаточно монет');
    }

    const existingParticipant = await this.prisma.raffleParticipant.findFirst({
      where: {userId, raffleId},
    });

    if (existingParticipant) {
      throw new BadRequestException('Вы уже участвуете в этом розыгрыше');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {id: userId},
        data: {balance: {decrement: raffle.price}},
      }),
      this.prisma.raffleParticipant.create({
        data: {userId, raffleId},
      }),
    ]);

    return {message: 'Вы успешно участвуете в розыгрыше'};
  }

  async getRaffleParticipants(raffleId: number) {
    // Проверяем наличие розыгрыша
    await this.getRaffleById(raffleId);
    const participants = await this.prisma.raffleParticipant.findMany({
      where: {raffleId},
      include: {user: true},
    });
    return participants;
  }
}
