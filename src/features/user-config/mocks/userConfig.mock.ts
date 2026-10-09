import {
  defaultUserConfigPayload,
  type UserConfigDto,
} from '@/features/user-config/types/userConfig.types';

export const userConfigMock: UserConfigDto = {
  id: 1,
  userId: 7,
  ...defaultUserConfigPayload,
};
