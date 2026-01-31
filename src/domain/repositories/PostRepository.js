module.exports = class PostRepository {
  async create(postData) {
    throw new Error("Method create must be implemented by subclass");
  }

  async findAll() {
    throw new Error("Method findAll must be implemented by subclass");
  }

  async findById(id) {
    throw new Error("Method findById must be implemented by subclass");
  }

  async update(id, postData) {
    throw new Error("Method update must be implemented by subclass");
  }

  async delete(id) {
    throw new Error("Method delete must be implemented by subclass");
  }
};
