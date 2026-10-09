import {
  defaultUserConfigPayload,
  type UserConfigDto,
} from '@/types/userConfig';

export const userConfigMock: UserConfigDto = {
  id: 1,
  userId: 7,
  ...defaultUserConfigPayload,
};
