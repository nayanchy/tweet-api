export interface UserType {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
  address: string;
  isMarried: boolean;
  password: string;
}

export interface UserResponse {
  status: string;
  message: string;
  data?: UserType | UserType[];
}
