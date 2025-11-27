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

export type Category = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  location: string;
  description: string;
  barcodes: string;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
};
