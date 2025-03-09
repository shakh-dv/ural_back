export const regenInterval = 1200; // in seconds

import * as path from 'path';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const SERVER_STATIC = {
  ROOT: IS_PRODUCTION ? '/app' : process.cwd(), // Корневой путь
  PATH: IS_PRODUCTION ? '/app/uploads' : path.join(process.cwd(), 'uploads'), // Путь к директории uploads
  NAME: 'uploads',
};
