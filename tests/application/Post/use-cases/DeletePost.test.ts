import { createMockRepository } from "../../../helpers";
import { DeletePostUseCase } from "../../../../src/application/post/use-cases/DeletePost";
import { PostNotFoundError } from "../../../../src/domain/errors/PostNotFoundError";

describe("DeletePostUseCase", () => {
  it("deve deletar o post com sucesso quando ele existir", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    const useCaseDelete = new DeletePostUseCase(mockRepo);

    const postId = 1;

    mockRepo.delete.mockResolvedValue(true);

    // Act
    await useCaseDelete.execute(postId);

    // Assert
    expect(mockRepo.delete).toHaveBeenCalledTimes(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(postId);
    expect(mockRepo.delete).toHaveLength(0);
  });

  it("deve lançar PostNotFoundError quando o post não existir", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    const useCaseDelete = new DeletePostUseCase(mockRepo);

    mockRepo.delete.mockResolvedValue(false);

    // Act + Assert
    await expect(useCaseDelete.execute(1)).rejects.toThrow(
      new PostNotFoundError(1),
    );
  });
});
