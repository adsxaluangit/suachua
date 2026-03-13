const db = require("../models");
const Request = db.repairRequests;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    const request = {
        id: `REQ${Date.now()}`,
        title: req.body.title,
        description: req.body.description,
        department: req.body.department,
        location: req.body.location,
        status: req.body.status,
        priority: req.body.priority,
        submittedDate: req.body.submittedDate ? req.body.submittedDate : new Date(),
        imageUrl: req.body.imageUrl,
        userId: req.body.userId // Optional
    };

    Request.create(request)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error creating Request." }));
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    Request.findAll({ where: condition, order: [['submittedDate', 'DESC']] })
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error retrieving Requests." }));
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Request.findByPk(id)
        .then(data => {
            if (data) res.send(data);
            else res.status(404).send({ message: `Cannot find Request with id=${id}.` });
        })
        .catch(err => res.status(500).send({ message: "Error retrieving Request with id=" + id }));
};

exports.update = (req, res) => {
    const id = req.params.id;
    Request.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: "Request was updated successfully." });
            else res.send({ message: `Cannot update Request with id=${id}. Maybe Request was not found or req.body is empty!` });
        })
        .catch(err => res.status(500).send({ message: "Error updating Request with id=" + id }));
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Request.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: "Request was deleted successfully!" });
            else res.send({ message: `Cannot delete Request with id=${id}. Maybe Request was not found!` });
        })
        .catch(err => res.status(500).send({ message: "Could not delete Request with id=" + id }));
};
