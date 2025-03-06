import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {CreateBoostItemDto} from './dto/create-boost-item.dto';
import {UpdateBoostItemDto} from './dto/update-boost-item.dto';
import {BoostItem} from '@prisma/client';

@Injectable()
export class BoostItemsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllBoostItems(): Promise<BoostItem[]> {
    return this.prismaService.boostItem.findMany();
  }

  async getBoostItemById(itemId: number): Promise<BoostItem> {
    const item = await this.prismaService.boostItem.findUnique({
      where: {id: itemId},
    });
    if (!item) {
      throw new NotFoundException('Boost item not found');
    }
    return item;
  }

  async createBoostItem(data: CreateBoostItemDto): Promise<BoostItem> {
    return this.prismaService.boostItem.create({
      data: {
        title: data.title,
        description: data.description,
        cost: data.cost,
        effectType: data.effectType,
        effectValue: data.effectValue,
        active: data.active ?? true,
      },
    });
  }

  async updateBoostItem(
    itemId: number,
    data: UpdateBoostItemDto
  ): Promise<BoostItem> {
    await this.getBoostItemById(itemId);
    return this.prismaService.boostItem.update({
      where: {id: itemId},
      data,
    });
  }

  async deleteBoostItem(itemId: number): Promise<BoostItem> {
    await this.getBoostItemById(itemId);
    return this.prismaService.boostItem.delete({
      where: {id: itemId},
    });
  }
}
