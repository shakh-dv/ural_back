import {Controller, Post, Param, Query, ParseIntPipe} from '@nestjs/common';
import {BoostEffectsService} from './boost-effects.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Boost Effects')
@Controller('boost-effects')
export class BoostEffectsController {
  constructor(private readonly boostEffectsService: BoostEffectsService) {}

  @Post(':id/purchase')
  @ApiOperation({summary: 'Купить и применить буст'})
  @ApiParam({name: 'id', type: Number, description: 'ID буста'})
  @ApiQuery({name: 'userId', type: Number, description: 'ID пользователя'})
  @ApiResponse({status: 200, description: 'Буст успешно применён'})
  async purchaseBoost(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number
  ) {
    return this.boostEffectsService.applyBoostEffect(userId, id);
  }
}
