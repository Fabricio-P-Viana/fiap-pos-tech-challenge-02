export class PostNotFoundError extends Error {
  constructor(id: number) {
    super(`Post with id ${id} not found`);
    this.name = "PostNotFoundError";
  }
}
