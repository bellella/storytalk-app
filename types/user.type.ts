import {
  SocialLoginResponseDtoUser,
  UserProfileDto,
} from '@/lib/api/generated/model';
import { userGetMe } from '@/lib/api/generated/user/user';

export interface User extends SocialLoginResponseDtoUser {}

export interface UserProfile extends UserProfileDto {}

export type tokens = {
  accessToken: string;
  refreshToken: string;
};
