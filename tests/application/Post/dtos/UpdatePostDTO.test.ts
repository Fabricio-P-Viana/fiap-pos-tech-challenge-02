import { UpdatePostDTO } from "../../../../src/application/post/dtos";
import { ValidationError } from "../../../../src/domain/errors/ValidationError";

describe("UpdatePostDTO", () => {
  describe("create", () => {
    it("deve criar DTO quando apenas title for enviado", () => {
      // Arrange
      const data = {
        title: " Novo título ",
      };

      // Act
      const dto = UpdatePostDTO.create(data);

      // Assert
      expect(dto.title).toBe("Novo título");
      expect(dto.content).toBeUndefined();
    });

    it("deve criar DTO quando apenas content for enviado", () => {
      // Arrange
      const data = {
        content: " Novo conteúdo ",
      };

      // Act
      const dto = UpdatePostDTO.create(data);

      // Assert
      expect(dto.content).toBe("Novo conteúdo");
      expect(dto.title).toBeUndefined();
    });

    it("deve criar DTO quando ambos forem enviados", () => {
      // Arrange
      const data = {
        title: "Título",
        content: "Conteúdo",
      };

      // Act
      const dto = UpdatePostDTO.create(data);

      // Assert
      expect(dto.title).toBe("Título");
      expect(dto.content).toBe("Conteúdo");
    });

    it("deve lançar erro quando nenhum campo for enviado", () => {
      // Arrange
      const data = {};

      // Act + Assert
      expect(() => UpdatePostDTO.create(data)).toThrow(
        "At least one field (title or content) must be provided",
      );
    });

    it("deve lançar erro quando title for inválido", () => {
      // Arrange
      const data = {
        title: "   ",
      };

      // Act + Assert
      expect(() => UpdatePostDTO.create(data)).toThrow(
        "Title must be a non-empty string",
      );
    });

    it("deve lançar erro quando content for inválido", () => {
      // Arrange
      const data = {
        content: "",
      };

      // Act + Assert
      expect(() => UpdatePostDTO.create(data)).toThrow(ValidationError);
    });

    it("deve lançar erro quando tipos forem inválidos", () => {
      // Arrange
      const data = {
        title: 123,
      };

      // Act + Assert
      expect(() => UpdatePostDTO.create(data)).toThrow(ValidationError);
    });
  });
});
