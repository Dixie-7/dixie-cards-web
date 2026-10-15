export type UserParticleShape =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'star'
  | 'basic';

export type UserParticleDirection = 'none' | 'top' | 'bottom' | 'left' | 'right';

export type UserParticleHoverMode = 'repulse' | 'grab' | 'bubble';

export interface UserParticlesConfig {
  enabled: boolean;
  count: number;
  color: string;
  shape: UserParticleShape;
  minSize: number;
  maxSize: number;
  speed: number;
  direction: UserParticleDirection;
  opacity: number;
  linksEnabled: boolean;
  linksColor: string;
  hoverEnabled: boolean;
  hoverMode: UserParticleHoverMode;
}

export interface UserConfigDto {
  id: number;
  userId: number;
  songUrl: string | null;
  showSong: boolean;
  particles: UserParticlesConfig | null;
  showProjectsSection: boolean;
  showSkillsSection: boolean;
  showLanguagesSection: boolean;
  showContactSection: boolean;
  showCardsSection: boolean;
  showCardNumber: boolean;
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

export const defaultUserParticlesConfig: UserParticlesConfig = {
  enabled: true,
  count: 45,
  color: '#a855f7',
  shape: 'circle',
  minSize: 1,
  maxSize: 3,
  speed: 0.45,
  direction: 'none',
  opacity: 0.25,
  linksEnabled: false,
  linksColor: '#c084fc',
  hoverEnabled: true,
  hoverMode: 'repulse',
};

export const defaultUserConfigPayload: UserConfigPayload = {
  songUrl: null,
  showSong: true,
  particles: null,
  showProjectsSection: true,
  showSkillsSection: true,
  showLanguagesSection: true,
  showContactSection: true,
  showCardsSection: true,
  showCardNumber: true,
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
