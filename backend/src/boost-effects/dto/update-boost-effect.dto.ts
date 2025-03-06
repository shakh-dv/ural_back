import {PartialType} from '@nestjs/swagger';
import {CreateBoostEffectDto} from './create-boost-effect.dto';

export class UpdateBoostEffectDto extends PartialType(CreateBoostEffectDto) {}
