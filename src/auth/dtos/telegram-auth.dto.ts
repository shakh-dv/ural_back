export class TelegramUserDto {
  id!: number;
  first_name!: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
  is_bot?: boolean;
}

export class TelegramAuthDto {
  query_id!: string;
  user!: TelegramUserDto;
  auth_date!: number;
  hash!: string;
}
