export interface UserFileDto {
  id: number;
  userId: number;
  name: string;
  description?: string | null;
  fileUrl: string;
  fileType: string;
  isPrimaryCv: boolean;
  uploadedAt: string;
}

export type UserFilePayload = Omit<
  UserFileDto,
  'id' | 'userId' | 'uploadedAt'
>;
