export interface UserCardBlockDto {
  id: number;
  userCardId: number;
  type: string;
  title?: string | null;
  content?: string | null;
  mediaUrl?: string | null;
  icon?: string | null;
  template?: string | null;
  styleText?: string | null;
  caption?: string | null;
  width: number;
  sortOrder: number;
}

export interface UserCardDto {
  id: number;
  userId: number;
  title: string;
  description?: string | null;
  template?: string | null;
  styleText?: string | null;
  width: number;
  sortOrder: number;
  blocks: UserCardBlockDto[];
}
