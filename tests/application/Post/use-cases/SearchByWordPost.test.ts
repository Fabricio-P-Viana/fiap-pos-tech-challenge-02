import { SearchByWordPostUseCase } from "../../../../src/application/post/use-cases";
import { Post } from "../../../../src/domain/entities/Post";
import { createMockRepository } from "../../../helpers";

describe("SearchByWordPostUseCase", () => {
  it("deve retornar posts que contêm a palavra buscada", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    const useCase = new SearchByWordPostUseCase(mockRepo);

    const searchWord = "test";
    const matchingPosts: Post[] = [
      {
        id: 1,
        title: "Test Post",
        content: "This is a test post.",
        authorId: 0,
      },
      {
        id: 2,
        title: "Another Test",
        content: "Testing is important.",
        authorId: 0,
      },
    ];

    mockRepo.searchByWord.mockResolvedValue(matchingPosts);

    // Act
    const result = await useCase.execute(searchWord);

    // Assert
    expect(mockRepo.searchByWord).toHaveBeenCalledTimes(1);
    expect(mockRepo.searchByWord).toHaveBeenCalledWith(searchWord);
    expect(result).toEqual(matchingPosts);
  });

  it("deve retornar lista vazia quando nenhum post corresponder", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    const useCase = new SearchByWordPostUseCase(mockRepo);

    const searchWord = "test";
    const matchingPosts: Post[] = [];

    mockRepo.searchByWord.mockResolvedValue(matchingPosts);
    // Act
    const result = await useCase.execute(searchWord);

    // Assert
    expect(mockRepo.searchByWord).toHaveBeenCalledTimes(1);
    expect(mockRepo.searchByWord).toHaveBeenCalledWith(searchWord);
    expect(result).toEqual(matchingPosts);
  });
});
