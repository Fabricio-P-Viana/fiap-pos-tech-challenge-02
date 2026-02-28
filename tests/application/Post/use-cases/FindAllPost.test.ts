import { FindAllPostUseCase } from "../../../../src/application/post/use-cases/FindAllPost";
import { createMockRepository } from "../../../helpers";

describe("FindAllPostUseCase", () => {
  it("deve retornar a lista de posts do repositório", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    const useCase = new FindAllPostUseCase(mockRepo);

    const fakePosts = [
      {
        id: 1,
        title: "Post 1",
        content: "Conteúdo 1",
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: "Post 2",
        content: "Conteúdo 2",
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    mockRepo.findAll.mockResolvedValue(fakePosts);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakePosts);
    expect(result).toHaveLength(2);
  });

  it("deve retornar lista vazia quando não houver posts", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    const useCase = new FindAllPostUseCase(mockRepo);

    mockRepo.findAll.mockResolvedValue([]);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});
