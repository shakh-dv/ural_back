import {
  Controller,
  Post,
  UseInterceptors,
  Get,
  Param,
  BadRequestException,
  UploadedFile,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {UploadsService} from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }
    return this.uploadsService.create(file);
  }

  @Get()
  getAll() {
    return this.uploadsService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.uploadsService.delete(id);
  }
}
