import type { UserRepository } from "../../../domain/repositories/UserRepository.ts";
import type { User } from "../../../domain/entities/User.ts";
import type { UpdateUserDTO } from "../dtos/index.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.ts";
import { AuthService } from "../../../domain/services/AuthService.ts";

export class UpdateUserUseCase {
  private userRepository: UserRepository;
  private authService: AuthService;

  constructor(userRepository: UserRepository, authService: AuthService) {
    this.userRepository = userRepository;
    this.authService = authService;
  }

  async execute(
    userId: number,
    dto: UpdateUserDTO,
    currentUserId?: number,
  ): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    if (currentUserId && user.isMe(currentUserId) && !user.isTeacher()) {
      throw new UnauthorizedError(userId);
    }

    const updated = await this.userRepository.update(user.id as number, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.password !== undefined && {
        password: await this.authService.hashPassword(dto.password),
      }),
    });

    if (!updated) {
      throw new UserNotFoundError(userId);
    }

    return updated;
  }
}
