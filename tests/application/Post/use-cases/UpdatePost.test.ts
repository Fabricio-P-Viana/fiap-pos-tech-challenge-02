import { UpdatePostDTO } from "../../../../src/application/post/dtos/UpdatePostDTO";
import { UpdatePostUseCase } from "../../../../src/application/post/use-cases";
import { Post } from "../../../../src/domain/entities/Post";
import { PostNotFoundError } from "../../../../src/domain/errors/PostNotFoundError";
import { createMockRepository } from "../../../helpers";

describe("UpdatePostUseCase", () => {
  it("deve chamar repository.update e retornar o post atualizado", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    const useCase = new UpdatePostUseCase(mockRepo);

    const dataToUpdate: Partial<Post> = {
      content: "Updated Post Content",
      title: "Updated Post Title",
    };

    const dto = UpdatePostDTO.create(dataToUpdate);

    const post = {
      id: 1,
      title: dto.title as string,
      content: dto.content as string,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepo.findById.mockResolvedValue(post);
    mockRepo.update.mockResolvedValue(post);

    // Act
    const result = await useCase.execute(post.id as number, dto, post.authorId);

    // Assert
    expect(mockRepo.update).toHaveBeenCalledTimes(1);
    expect(mockRepo.update).toHaveBeenCalledWith(post.id as number, dto);
    expect(result).toEqual(post);
  });

  it("deve lançar PostNotFoundError quando o post não existir", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    const useCase = new UpdatePostUseCase(mockRepo);

    const dataToUpdate: Partial<Post> = {
      content: "Updated Post Content",
      title: "Updated Post Title",
    };

    const dto = UpdatePostDTO.create(dataToUpdate);

    const post: Post = {
      id: 1,
      title: dto.title as string,
      content: dto.content as string,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepo.update.mockResolvedValue(false);

    // Act + Assert
    expect(useCase.execute(post.id as number, dto)).rejects.toThrow(
      new PostNotFoundError(post.id as number),
    );
  });
});
