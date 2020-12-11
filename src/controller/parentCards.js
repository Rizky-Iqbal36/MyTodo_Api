const {
  ParentCards,
  ChildCards,
  cardRelations,
  Users,
} = require("../../models");
const joi = require("joi");

exports.parentCardsByUser = async (req, res) => {
  try {
    const { uploadBy } = req.params;
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
      where: { uploadBy },
    });
    res.status(200).send({
      message: `User with id:${uploadBy}'s parent cards succesfully loaded`,
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
exports.read = async (req, res) => {
  try {
    const loadParentCards = await ParentCards.findAll({
      include: [
        {
          model: ChildCards,
          as: "child",
          through: {
            model: cardRelations,
            as: "data",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "UserId",
                "ParentCardId",
                "ChildCardId",
              ],
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: Users,
          as: "users",
          through: {
            model: cardRelations,
            as: "data",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "UserId",
                "ParentCardId",
                "ChildCardId",
              ],
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
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
    const { title, uploadBy, description } = req.body;
    const schema = joi.object({
      title: joi.string().required(),
      description: joi.string().allow("", null),
      uploadBy: joi.required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }
    let createParentCard = [];
    if (!req.file) {
      createParentCard = await ParentCards.create({
        ...req.body,
      });
    } else {
      createParentCard = await ParentCards.create({
        ...req.body,
        thumbnailParentCard: req.file.filename,
      });
    }
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
    console.log(body);
    await ParentCards.update(
      {
        title: body.title,
        description: body.description,
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
      message: `Parent card with id:${id} successfully updated`,
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
