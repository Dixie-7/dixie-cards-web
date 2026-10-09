export interface SkillDto {
  id: number;
  userId: number;
  skillName: string;
  skillDescription?: string | null;
  skillNote?: string | null;
  skillIcon?: string | null;
  skillColor?: string | null;
  sortOrder: number;
}

export type SkillPayload = Omit<SkillDto, 'id' | 'userId'>;
