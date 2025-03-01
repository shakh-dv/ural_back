import {IsString, IsInt, IsOptional, IsBoolean} from 'class-validator';

export class UpdateBoostItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  cost?: number;

  @IsOptional()
  @IsString()
  effectType?: string;

  @IsOptional()
  @IsInt()
  effectValue?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
