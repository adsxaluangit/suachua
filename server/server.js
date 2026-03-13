const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();

var corsOptions = {
    origin: "http://localhost:5173" // Vite default port
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./models");

// Sync database
// strategies: force: true (drops tables), alter: true (updates tables)
// For development, we'll use sync() which creates if not exists
db.sequelize.sync({ alter: true }).then(() => {
    console.log("VariouTable re-sync db.");
});

// Simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to PMSuaChua application." });
});

// Mock Strapi Auth Endpoint
app.post("/api/auth/local", (req, res) => {
    const { identifier, password } = req.body;
    db.users.findOne({ where: { email: identifier } })
        .then(user => {
            if (!user) return res.status(404).send({ error: { message: "User Not found." } });
            if (user.password && user.password !== password) {
                return res.status(401).send({ error: { message: "Invalid Password!" } });
            }
            res.status(200).send({
                jwt: "mock_jwt_token_12345",
                user: {
                    id: user.id,
                    documentId: user.id,
                    username: user.name,
                    email: user.email,
                    department: user.department,
                    user_role: user.role
                }
            });
        })
        .catch(err => res.status(500).send({ error: { message: err.message } }));
});

// Routes
require("./routes/user.routes")(app);
require("./routes/building.routes")(app);
require("./routes/room.routes")(app);
require("./routes/request.routes")(app);

// Seed Route (Optional, for development)
const seedController = require("./controllers/seed.controller");
app.post("/api/seed", seedController.seed);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
