import {ApiProperty} from '@nestjs/swagger';
import {IsInt} from 'class-validator';

export class JoinRaffleDTO {
  @ApiProperty({description: 'ID пользователя, участвующего в розыгрыше'})
  @IsInt()
  userId!: number;
}
