export interface UserLanguageDto {
  id: number;
  userId: number;
  language: string;
  level: string;
  skillPercent: number;
  sortOrder: number;
}

export type UserLanguagePayload = Omit<UserLanguageDto, 'id' | 'userId'>;
