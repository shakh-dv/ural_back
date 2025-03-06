import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import {LevelConfigService} from './level-config.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('LevelConfig')
@Controller('level-config')
export class LevelConfigController {
  constructor(private readonly levelConfigService: LevelConfigService) {}

  @Get()
  @ApiOperation({summary: 'Получить список всех конфигураций уровней'})
  @ApiResponse({status: 200, description: 'Список конфигураций уровней'})
  async getAll() {
    return this.levelConfigService.getAll();
  }

  @Get(':level')
  @ApiOperation({summary: 'Получить конфигурацию уровня по номеру'})
  @ApiParam({name: 'level', type: Number, description: 'Номер уровня'})
  async getOne(@Param('level') level: string) {
    return this.levelConfigService.getOne(Number(level));
  }

  @Post()
  @ApiOperation({summary: 'Создать новую конфигурацию уровня'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        level: {type: 'number', example: 5},
        maxEnergy: {type: 'number', example: 110},
      },
      required: ['level', 'maxEnergy'],
    },
  })
  async create(@Body() data: {level: number; maxEnergy: number}) {
    return this.levelConfigService.create(data);
  }

  @Patch(':level')
  @ApiOperation({summary: 'Обновить конфигурацию уровня'})
  @ApiParam({name: 'level', type: Number, description: 'Номер уровня'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        maxEnergy: {type: 'number', example: 120},
      },
      required: ['maxEnergy'],
    },
  })
  async update(
    @Param('level', ParseIntPipe) level: number,
    @Body() data: {maxEnergy: number}
  ) {
    return this.levelConfigService.update(Number(level), data);
  }

  @Delete(':level')
  @ApiOperation({summary: 'Удалить конфигурацию уровня'})
  @ApiParam({name: 'level', type: Number, description: 'Номер уровня'})
  async delete(@Param('level', ParseIntPipe) level: number) {
    return this.levelConfigService.delete(Number(level));
  }
}
