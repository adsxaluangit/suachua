module.exports = (sequelize, Sequelize) => {
    const Building = sequelize.define("building", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: Sequelize.STRING
        },
        code: {
            type: Sequelize.STRING,
            unique: true
        },
        description: {
            type: Sequelize.STRING
        }
    });

    return Building;
};
