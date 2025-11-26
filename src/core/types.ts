export const USER_TYPES = {
  Sysadmin: 'sysadmin',
  Admin: 'admin',
  Manager: 'manager',
  Service: 'service',
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

export type User = {
  id: number;
  fullName: string;
  type: UserType;
  createdAt: string;
  updatedAt: string;
};

export type PublicUser = User;
export type UserProfile = PublicUser;
