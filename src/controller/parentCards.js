const { ParentCards, ChildCards, cardRelations } = require("../../models");
const joi = require("joi");

exports.read = async (req, res) => {
  try {
    const loadParentCards = await ParentCards.findAll({
      include: {
        model: ChildCards,
        as: "child",
        through: {
          model: cardRelations,
          as: "data",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send({
      message: "Parent cards has successfully Loaded",
      data: { loadParentCards },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "Server ERROR :(",
      },
    });
  }
};

exports.readOne = async (req, res) => {
  try {
    const { id } = req.params;
    const findParentCard = await ParentCards.findOne({
      include: {
        model: ChildCards,
        as: "child",
        through: {
          model: cardRelations,
          as: "data",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: { id },
    });
    if (!findParentCard) {
      return res.status(400).send({
        message: `There is no parent card with id :${id}`,
      });
    }
    res.status(200).send({
      message: `Parent card with id: ${id} has successfully Loaded`,
      data: { findParentCard },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "Server ERROR :(",
      },
    });
  }
};
exports.create = async (req, res) => {
  try {
    const { title, uploadBy } = req.body;
    const schema = joi.object({
      title: joi.string().required(),
      uploadBy: joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }
    const createParentCard = await ParentCards.create({
      ...req.body,
      thumbnailParentCard: req.file.filename,
    });
    res.status(200).send({
      message: "New parent card has successfully created",
      data: { createParentCard },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "Server ERROR :(",
      },
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const findParentCard = await ParentCards.findOne({
      where: { id },
    });
    if (!findParentCard) {
      return res.status(400).send({
        message: `There is no parent card with id :${id}`,
      });
    }
    await ParentCards.destroy({
      where: { id },
    });
    res.status(200).send({
      message: `Parent card with id: ${id} has successfully deleted`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "Server ERROR :(",
      },
    });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const findParentCard = await ParentCards.findOne({
      where: { id },
    });
    if (!findParentCard) {
      return res.status(400).send({
        message: `There is no parent card with id :${id}`,
      });
    }
    const body = req.body;
    await ParentCards.update(
      {
        title: body.title,
      },
      { where: { id } }
    );
    res.status(200).send({
      message: `Parent Card with id: ${id} has successfully updated`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "Server ERROR :(",
      },
    });
  }
};

exports.updateThumbnail = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await ParentCards.update(
      {
        thumbnailParentCard: req.file.filename,
      },
      { where: { id } }
    );
    if (!updated) {
      return res.status(404).send({
        status: "fail",
        message: `There is no parent card with id :${id}`,
        code: 404,
      });
    }
    res.send({
      status: "success",
      message: `There is no parent card with id:${id}`,
      path: req.file.path,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "Server ERROR :(",
      },
    });
  }
};
