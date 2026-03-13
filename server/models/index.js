const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.users = require("./user.model.js")(sequelize, Sequelize);
db.buildings = require("./building.model.js")(sequelize, Sequelize);
db.rooms = require("./room.model.js")(sequelize, Sequelize);
db.repairRequests = require("./repair-request.model.js")(sequelize, Sequelize);

// Associations
// Building <-> Room (One-to-Many)
db.buildings.hasMany(db.rooms, { as: "rooms", foreignKey: "buildingId" });
db.rooms.belongsTo(db.buildings, { foreignKey: "buildingId", as: "building" });

// Maybe User <-> RepairRequest (One-to-Many) - Not strictly defined in types but useful
// db.users.hasMany(db.repairRequests, { as: "requests" });
// db.repairRequests.belongsTo(db.users, { foreignKey: "userId", as: "requester" });

module.exports = db;
