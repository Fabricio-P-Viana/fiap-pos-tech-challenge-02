export function createMockRepository() {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    searchByWord: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}
