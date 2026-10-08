export interface UserContactDto {
  id: number;
  userId: number;
  publicEmail?: string | null;
  altEmail?: string | null;
  phone?: string | null;
  altPhone?: string | null;
  site?: string | null;
  instagram?: string | null;
  gitHub?: string | null;
  facebook?: string | null;
  linkedIn?: string | null;
}

export type UserContactPayload = Omit<UserContactDto, 'id' | 'userId'>;
