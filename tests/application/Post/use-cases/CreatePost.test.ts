import { CreatePostUseCase } from "../../../../src/application/post/use-cases/CreatePost";
import { CreatePostDTO } from "../../../../src/application/post/dtos/CreatePostDTO";
import { createMockRepository } from "../../../helpers";

describe("CreatePostUseCase", () => {
  it("deve chamar repository.create com os dados e retornar o post criado", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    const useCase = new CreatePostUseCase(mockRepo);

    const dto = CreatePostDTO.create({
      title: "Novo Post",
      content: "Conteúdo do post",
    });
    const fakeCreatedPost = {
      id: 1,
      title: dto.title,
      content: dto.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepo.create.mockResolvedValue(fakeCreatedPost);

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(mockRepo.create).toHaveBeenCalledWith({
      title: dto.title,
      content: dto.content,
    });
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeCreatedPost);
  });

  it("deve propagar o erro quando o repositório falhar", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    const useCase = new CreatePostUseCase(mockRepo);

    const dto = CreatePostDTO.create({ title: "Post", content: "Conteúdo" });
    mockRepo.create.mockRejectedValue(new Error("Erro ao criar post"));

    // Act & Assert
    await expect(useCase.execute(dto)).rejects.toThrow("Erro ao criar post");
  });
});
