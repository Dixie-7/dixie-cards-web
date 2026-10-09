export interface UserConfigDto {
  id: number;
  userId: number;
  showProjectsSection: boolean;
  showSkillsSection: boolean;
  showLanguagesSection: boolean;
  showContactSection: boolean;
  showCardsSection: boolean;
  showCv: boolean;
  showEmail: boolean;
  showAltEmail: boolean;
  showPhone: boolean;
  showAltPhone: boolean;
  showInstagram: boolean;
  showGitHub: boolean;
  showFacebook: boolean;
  showLinkedIn: boolean;
  showWebsite: boolean;
  showLanguagePercent: boolean;
  showLanguageLevel: boolean;
}

export type UserConfigPayload = Omit<UserConfigDto, 'id' | 'userId'>;

export const defaultUserConfigPayload: UserConfigPayload = {
  showProjectsSection: true,
  showSkillsSection: true,
  showLanguagesSection: true,
  showContactSection: true,
  showCardsSection: true,
  showCv: true,
  showEmail: true,
  showAltEmail: true,
  showPhone: true,
  showAltPhone: true,
  showInstagram: true,
  showGitHub: true,
  showFacebook: true,
  showLinkedIn: true,
  showWebsite: true,
  showLanguagePercent: true,
  showLanguageLevel: true,
};
