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
import {BoostItemsService} from './boost-items.service';
import {CreateBoostItemDto} from './dto/create-boost-item.dto';
import {UpdateBoostItemDto} from './dto/update-boost-item.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Boost Items (Admin)')
@Controller('boost-items')
export class BoostItemsController {
  constructor(private readonly boostItemsService: BoostItemsService) {}

  @Get()
  @ApiOperation({summary: 'Получить список всех бустов'})
  @ApiResponse({status: 200, description: 'Список бустов'})
  async getAll() {
    return this.boostItemsService.getAllBoostItems();
  }

  @Get(':id')
  @ApiOperation({summary: 'Получить буст по ID'})
  @ApiParam({name: 'id', type: Number, description: 'ID буста'})
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.boostItemsService.getBoostItemById(id);
  }

  @Post()
  @ApiOperation({summary: 'Создать новый буст'})
  @ApiBody({type: CreateBoostItemDto})
  async create(@Body() data: CreateBoostItemDto) {
    return this.boostItemsService.createBoostItem(data);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Обновить буст'})
  @ApiParam({name: 'id', type: Number, description: 'ID буста'})
  @ApiBody({type: UpdateBoostItemDto})
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateBoostItemDto
  ) {
    return this.boostItemsService.updateBoostItem(id, data);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Удалить буст'})
  @ApiParam({name: 'id', type: Number, description: 'ID буста'})
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.boostItemsService.deleteBoostItem(id);
  }
}
