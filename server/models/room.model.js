module.exports = (sequelize, Sequelize) => {
    const Room = sequelize.define("room", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        buildingId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        roomNumber: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        floor: {
            type: Sequelize.INTEGER
        }
    });

    return Room;
};
