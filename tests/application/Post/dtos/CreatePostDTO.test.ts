import { CreatePostDTO } from "../../../../src/application/post/dtos";
import { ValidationError } from "../../../../src/domain/errors/ValidationError";

describe("CreatePostDTO", () => {
  describe("create", () => {
    it("deve criar DTO quando dados válidos forem informados", () => {
      // Arrange
      const data = {
        title: " Meu título ",
        content: " Meu conteúdo ",
        authorId: 1,
      };

      // Act
      const dto = CreatePostDTO.create(data);

      // Assert
      expect(dto.title).toBe("Meu título");
      expect(dto.content).toBe("Meu conteúdo");
    });

    it("deve lançar erro quando title estiver ausente", () => {
      // Arrange
      const data = {
        content: "Conteúdo válido",
      };

      // Act + Assert
      expect(() => CreatePostDTO.create(data)).toThrow(ValidationError);
    });

    it("deve lançar erro quando content estiver ausente", () => {
      // Arrange
      const data = {
        title: "Título válido",
      };

      // Act + Assert
      expect(() => CreatePostDTO.create(data)).toThrow(ValidationError);
    });

    it("deve lançar erro quando title for string vazia", () => {
      // Arrange
      const data = {
        title: "   ",
        content: "Conteúdo válido",
      };

      // Act + Assert
      expect(() => CreatePostDTO.create(data)).toThrow(
        "Title is required and must be a non-empty string",
      );
    });

    it("deve lançar erro quando content for string vazia", () => {
      // Arrange
      const data = {
        title: "Título válido",
        content: "   ",
      };

      // Act + Assert
      expect(() => CreatePostDTO.create(data)).toThrow(
        "Content is required and must be a non-empty string",
      );
    });

    it("deve lançar erro quando tipos forem inválidos", () => {
      // Arrange
      const data = {
        title: 123,
        content: true,
      };

      // Act + Assert
      expect(() => CreatePostDTO.create(data)).toThrow(ValidationError);
    });
  });
});
