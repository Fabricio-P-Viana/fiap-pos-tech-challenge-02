import { createMockRepository } from "../../../helpers";
import { FindOneByIdPostUseCase } from "../../../../src/application/post/use-cases";
import { Post } from "../../../../src/domain/entities/Post";

describe("FindOneByIdPostUseCase", () => {
  it("deve retornar o post quando encontrado", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    const useCase = new FindOneByIdPostUseCase(mockRepo);

    const postMock: Post = {
      id: 1,
      title: "Test Post",
      content: "This is a test post.",
      authorId: 1,
    };

    mockRepo.findById.mockResolvedValue(postMock);
    // Act
    const result = await useCase.execute(postMock.id as number);

    // Assert
    expect(mockRepo.findById).toHaveBeenCalledTimes(1);
    expect(mockRepo.findById).toHaveBeenCalledWith(postMock.id);
    expect(result).toEqual(postMock);
  });

  it("deve lançar PostNotFoundError quando o post não existir", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    const useCase = new FindOneByIdPostUseCase(mockRepo);

    mockRepo.findById.mockResolvedValue(null);

    // Act + Assert
    await expect(useCase.execute(1)).rejects.toThrow(
      "Post with id 1 not found",
    );
  });
});
