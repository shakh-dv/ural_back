import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsString, IsInt, IsDate, IsOptional} from 'class-validator';

export class CreateRaffleDTO {
  @ApiProperty({description: 'Название розыгрыша'})
  @IsString()
  title!: string;

  @ApiPropertyOptional({description: 'Описание розыгрыша'})
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({description: 'Стоимость участия (например, 500 монет)'})
  @IsInt()
  price!: number;

  @ApiPropertyOptional({description: 'ID изображения для розыгрыша'})
  @IsOptional()
  @IsInt()
  imageId?: number;

  @ApiProperty({description: 'Дата окончания участия', type: Date})
  @IsDate()
  endDate!: Date;
}
