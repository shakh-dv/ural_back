import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class CreateBoostItemDto {
  @ApiProperty({
    description: 'Название буста',
    example: 'Reset Taps',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    description: 'Описание буста',
    example: 'Мгновенно восстанавливает энергию до максимума',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Стоимость буста в очках',
    example: 300,
  })
  @IsInt()
  cost!: number;

  @ApiProperty({
    description:
      'Тип эффекта буста (например, "resetTaps", "doubleTapPoints", "increaseRegen")',
    example: 'resetTaps',
  })
  @IsString()
  @IsNotEmpty()
  effectType!: string;

  @ApiPropertyOptional({
    description:
      'Параметр эффекта, например длительность эффекта или величина корректировки',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  effectValue?: number;

  @ApiPropertyOptional({
    description: 'Флаг активности буста',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
