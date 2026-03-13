module.exports = (sequelize, Sequelize) => {
    const RepairRequest = sequelize.define("card_request", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        department: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        priority: {
            type: Sequelize.STRING
        },
        submittedDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        imageUrl: {
            type: Sequelize.STRING
        },
        userId: { // Assuming we store user link if possible
            type: Sequelize.STRING
        }
    });

    return RepairRequest;
};
