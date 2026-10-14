import type { UserCardDto } from '@/features/cards/types/userCard.types';
import type { UserContactDto } from '@/features/contact/types/contact.types';
import type { UserFileDto } from '@/features/files/types/userFile.types';
import type { UserLanguageDto } from '@/features/languages/types/language.types';
import type { ProjectDto } from '@/features/projects/types/project.types';
import type { SkillDto } from '@/features/skills/types/skill.types';

export type PublicLanguageDto = Omit<
  UserLanguageDto,
  'level' | 'skillPercent'
> & {
  level?: string | null;
  skillPercent?: number | null;
};

export interface PublicPortfolio {
  username: string;
  name?: string | null;
  lastName?: string | null;
  songUrl?: string | null;
  projects: ProjectDto[];
  skills: SkillDto[];
  languages: PublicLanguageDto[];
  cards: UserCardDto[];
  contact: UserContactDto | null;
  cv: UserFileDto | null;
}
