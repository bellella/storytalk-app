import {
  SocialLoginResponseDtoUser,
  UserProfileDto,
} from '@/lib/api/generated/model';

export interface User extends SocialLoginResponseDtoUser {}

export interface UserProfile extends UserProfileDto {}

export type tokens = {
  accessToken: string;
  refreshToken: string;
};
