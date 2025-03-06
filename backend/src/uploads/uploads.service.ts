import {BadRequestException, Injectable} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import {v4 as uuidv4} from 'uuid';
import * as sharp from 'sharp';
import {PrismaService} from '../core/infra/prisma/prisma.service';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  async resize(
    src: string,
    dst: string,
    size: number = 200
  ): Promise<sharp.OutputInfo> {
    const file = sharp(src);
    const meta = await file.metadata();
    return file
      .resize({
        width: Math.min(size, meta.width || 0),
        fit: sharp.fit.contain,
      })
      .webp({quality: 75})
      .toFile(dst);
  }

  async create(file: Express.Multer.File) {
    const mimetypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];

    if (!mimetypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new BadRequestException('File is too large!');
    }

    const basePath =
      process.env.NODE_ENV === 'production'
        ? '/app/uploads'
        : path.join(process.cwd(), 'uploads');

    const dispatchPath = path.join(basePath, 'dispatch');

    // Генерируем уникальное имя файла
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const fullPath = path.join(dispatchPath, filename);

    // Проверяем существование директории и создаем, если нужно
    try {
      await fs.promises.access(dispatchPath, fs.constants.F_OK);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.promises.mkdir(dispatchPath, {recursive: true});
      } else {
        throw new Error(`Error accessing directory: ${(err as Error).message}`);
      }
    }


    // Записываем файл на диск
    try {
      await fs.promises.writeFile(fullPath, file.buffer);
    } catch (err) {
      throw new Error(`Error writing file: ${(err as Error).message}`);
    }

    const basename = path.basename(filename, path.extname(filename));
    const xsFilename = path.join(dispatchPath, `${basename}-xs.webp`);
    const mdFilename = path.join(dispatchPath, `${basename}-md.webp`);

    const [xs, md] = await Promise.all([
      this.resize(fullPath, xsFilename, 200),
      this.resize(fullPath, mdFilename, 400),
    ]);

    const upload = await this.prisma.uploads.create({
      data: {
        filename: path.basename(filename),
        size: file.size,
        mimetype: file.mimetype,
        xsFilename: path.basename(xsFilename),
        xsSize: xs.size,
        mdFilename: path.basename(mdFilename),
        mdSize: md.size,
      },
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:4000';

    return {
      id: upload.id,
      filename: upload.filename,
      size: upload.size,
      mimetype: upload.mimetype,
      url: `${baseUrl}/uploads/dispatch/${upload.filename}`,
      xsUrl: `${baseUrl}/uploads/dispatch/${upload.xsFilename}`,
      mdUrl: `${baseUrl}/uploads/dispatch/${upload.mdFilename}`,
    };
  }

  findAll() {
    return 'This action returns all uploads';
  }

  async delete(id: number) {
    const upload = await this.prisma.uploads.delete({
      where: {
        id: id,
      },
    });
    return upload;
  }
}
