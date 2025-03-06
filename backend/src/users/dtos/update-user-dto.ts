import {ApiProperty} from '@nestjs/swagger';
import {IsInt, Min} from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty()
  @IsInt()
  @Min(0)
  balance!: number;
}
