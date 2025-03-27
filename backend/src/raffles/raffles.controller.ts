import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {RafflesService} from './raffles.service';
import {CreateRaffleDTO} from './dto/create-raffle.dto';
import {UpdateRaffleDTO} from './dto/update-raffle.dto';
import {JoinRaffleDTO} from './dto/join-raffle.dto';

@ApiTags('Raffles')
@Controller('raffles')
export class RafflesController {
  constructor(private readonly raffleService: RafflesService) {}

  @Post()
  @ApiOperation({summary: 'Создать новый розыгрыш'})
  @ApiResponse({status: 201, description: 'Розыгрыш успешно создан.'})
  @ApiResponse({status: 400, description: 'Ошибка валидации данных.'})
  create(@Body() data: CreateRaffleDTO) {
    return this.raffleService.createRaffle(data);
  }

  @Get()
  @ApiOperation({summary: 'Получить список всех розыгрышей'})
  @ApiResponse({status: 200, description: 'Список розыгрышей успешно получен.'})
  getAll() {
    return this.raffleService.getAllRaffles();
  }

  @Get(':id')
  @ApiOperation({summary: 'Получить розыгрыш по ID'})
  @ApiResponse({status: 200, description: 'Розыгрыш найден.'})
  @ApiResponse({status: 404, description: 'Розыгрыш не найден.'})
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.raffleService.getRaffleById(id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Обновить данные розыгрыша'})
  @ApiResponse({status: 200, description: 'Розыгрыш успешно обновлен.'})
  @ApiResponse({status: 400, description: 'Ошибка валидации данных.'})
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateRaffleDTO) {
    return this.raffleService.updateRaffle(id, data);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Удалить розыгрыш по ID'})
  @ApiResponse({status: 200, description: 'Розыгрыш успешно удален.'})
  @ApiResponse({status: 404, description: 'Розыгрыш не найден.'})
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.raffleService.deleteRaffle(id);
  }

  @Post(':id/join')
  @ApiOperation({summary: 'Принять участие в розыгрыше'})
  @ApiResponse({status: 200, description: 'Участие успешно оформлено.'})
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации данных или участник уже зарегистрирован.',
  })
  join(
    @Param('id', ParseIntPipe) raffleId: number,
    @Body() data: JoinRaffleDTO
  ) {
    return this.raffleService.joinRaffle(data.userId, raffleId);
  }

  @Get(':id/participants')
  @ApiOperation({summary: 'Получить список участников розыгрыша (админ)'})
  @ApiResponse({status: 200, description: 'Список участников успешно получен.'})
  @ApiResponse({status: 404, description: 'Розыгрыш не найден.'})
  getParticipants(@Param('id', ParseIntPipe) id: number) {
    return this.raffleService.getRaffleParticipants(id);
  }
}
