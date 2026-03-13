const db = require("../models");
const Room = db.rooms;
const Building = db.buildings;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const room = {
        id: `R${Date.now()}`,
        buildingId: req.body.buildingId,
        roomNumber: req.body.roomNumber,
        type: req.body.type,
        floor: req.body.floor
    };

    Room.create(room)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error creating Room." }));
};

exports.findAll = (req, res) => {
    const roomNumber = req.query.roomNumber;
    var condition = roomNumber ? { roomNumber: { [Op.iLike]: `%${roomNumber}%` } } : null;

    Room.findAll({ where: condition, include: [{ model: Building, as: "building" }] })
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error retrieving Rooms." }));
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Room.findByPk(id)
        .then(data => {
            if (data) res.send(data);
            else res.status(404).send({ message: `Cannot find Room with id=${id}.` });
        })
        .catch(err => res.status(500).send({ message: "Error retrieving Room with id=" + id }));
};

exports.update = (req, res) => {
    const id = req.params.id;
    Room.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: "Room was updated successfully." });
            else res.send({ message: `Cannot update Room with id=${id}. Maybe Room was not found or req.body is empty!` });
        })
        .catch(err => res.status(500).send({ message: "Error updating Room with id=" + id }));
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Room.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: "Room was deleted successfully!" });
            else res.send({ message: `Cannot delete Room with id=${id}. Maybe Room was not found!` });
        })
        .catch(err => res.status(500).send({ message: "Could not delete Room with id=" + id }));
};
