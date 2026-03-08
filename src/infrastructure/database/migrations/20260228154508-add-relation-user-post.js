export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("posts", "authorId", {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("posts", "authorId");
}
