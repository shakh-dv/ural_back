import * as crypto from 'crypto';

export function validateTelegramData(
  botToken: string,
  data: Record<string, any>
): boolean {
  console.log('Received data:', data); // Логируем входные данные

  const secret = crypto.createHash('sha256').update(botToken).digest();
  const checkString = Object.keys(data)
    .filter(key => key !== 'hash')
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');

  const hmac = crypto
    .createHmac('sha256', secret)
    .update(checkString)
    .digest('hex');

  return hmac === data.hash;
}
