module.exports = app => {
    const buildings = require("../controllers/building.controller.js");
    var router = require("express").Router();

    router.post("/", buildings.create);
    router.get("/", buildings.findAll);
    router.get("/:id", buildings.findOne);
    router.put("/:id", buildings.update);
    router.delete("/:id", buildings.delete);

    app.use('/api/buildings', router);
};
