export type DixieCardType =
  | "INTRODUCTION"
  | "ABOUT_ME"
  | "SKILLS"
  | "PROJECTS"
  | "CONTACT";

export type DixieCardBlockType =
  | "TEXT"
  | "IMAGE"
  | "SKILL"
  | "PROJECT"
  | "LINK"
  | "TEXT_IMAGE";

export interface DixieCardDto {
  id: number;
  title: string;
  subtitle?: string;
  type: DixieCardType;
  order: number;
  blocks: DixieCardBlockDto[];
}

export interface DixieCardBlockDto {
  id: number;
  type: DixieCardBlockType;
  title?: string;
  content?: string;
  imageUrl?: string;
  iconUrl?: string;
  linkUrl?: string;
  order: number;
}