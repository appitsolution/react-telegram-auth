export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
}

export interface TelegramAuthData extends TelegramUser {
  auth_date: number;
  hash: string;
}

export interface TelegramWidgetAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}
