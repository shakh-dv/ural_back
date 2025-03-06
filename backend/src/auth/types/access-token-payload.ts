export interface AccessTokenPayload {
  telegram_id: number;
  username?: string;
  avatar_url?: string;
  sub: string;
  name: string;
  iss: string;
  iat: number;
}
