const db = require("../models");
const Building = db.buildings;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const building = {
        id: `B${Date.now()}`,
        name: req.body.name,
        code: req.body.code,
        description: req.body.description
    };

    Building.create(building)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error creating Building." }));
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

    Building.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error retrieving Buildings." }));
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Building.findByPk(id)
        .then(data => {
            if (data) res.send(data);
            else res.status(404).send({ message: `Cannot find Building with id=${id}.` });
        })
        .catch(err => res.status(500).send({ message: "Error retrieving Building with id=" + id }));
};

exports.update = (req, res) => {
    const id = req.params.id;
    Building.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: "Building was updated successfully." });
            else res.send({ message: `Cannot update Building with id=${id}. Maybe Building was not found or req.body is empty!` });
        })
        .catch(err => res.status(500).send({ message: "Error updating Building with id=" + id }));
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Building.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: "Building was deleted successfully!" });
            else res.send({ message: `Cannot delete Building with id=${id}. Maybe Building was not found!` });
        })
        .catch(err => res.status(500).send({ message: "Could not delete Building with id=" + id }));
};
