import { PartialType } from '@nestjs/swagger';
import { CreateTapDto } from './create-tap.dto';

export class UpdateTapDto extends PartialType(CreateTapDto) {}
