import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsString, IsOptional, IsEnum, IsInt} from 'class-validator';
import {RaffleStatus} from './raffle-status.enum';

export class UpdateRaffleDTO {
  @ApiPropertyOptional({description: 'Новое название розыгрыша'})
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Новый статус розыгрыша',
    enum: RaffleStatus,
  })
  @IsOptional()
  @IsEnum(RaffleStatus)
  status?: RaffleStatus;

  @ApiPropertyOptional({description: 'Новый ID изображения для розыгрыша'})
  @IsOptional()
  @IsInt()
  imageId?: number;
}
