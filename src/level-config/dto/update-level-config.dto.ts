import { PartialType } from '@nestjs/swagger';
import { CreateLevelConfigDto } from './create-level-config.dto';

export class UpdateLevelConfigDto extends PartialType(CreateLevelConfigDto) {}
