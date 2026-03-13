module.exports = app => {
    const requests = require("../controllers/request.controller.js");
    var router = require("express").Router();

    router.post("/", requests.create);
    router.get("/", requests.findAll);
    router.get("/:id", requests.findOne);
    router.put("/:id", requests.update);
    router.delete("/:id", requests.delete);

    app.use('/api/requests', router);
};
