export interface UserModel {
  user_id: number;
  name: string;
  email: string;
  password: string;
  birthdate: Date;
  role: string;
}

export interface CreateUserRequest extends Omit<UserModel, "user_id" | "role"> {}

export interface CreateUserResponse extends Pick<UserModel, "user_id"> {}

export interface LoginUserRequest
  extends Pick<UserModel, "email" | "password"> {}

export interface LoginUserResponse {
  token: string;
}
