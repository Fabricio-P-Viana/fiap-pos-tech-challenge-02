import type { UserRepository } from "../../../domain/repositories/UserRepository.ts";
import type { User } from "../../../domain/entities/User.ts";
import type { CreateUserDTO } from "../dtos/index.ts";
import type { AuthService } from "../../../domain/services/AuthService.ts";

export class CreateUserUseCase {
  private userRepository: UserRepository;
  private authService: AuthService;

  constructor(userRepository: UserRepository, authService: AuthService) {
    this.userRepository = userRepository;
    this.authService = authService;
  }

  async execute(dto: CreateUserDTO): Promise<User> {
    const hashedPassword = await this.authService.hashPassword(dto.password);

    return this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });
  }
}
