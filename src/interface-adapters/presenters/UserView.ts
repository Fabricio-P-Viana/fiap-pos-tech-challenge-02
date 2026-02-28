import { User } from "../../domain/entities/User.ts";

interface UserViewData {
  id?: number | string | undefined;
  name: string;
  email: string;
  role?: string | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export default class UserView {
  static render(user: User): UserViewData {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static renderMany(users: User[]): UserViewData[] {
    return users.map(this.render);
  }
}
