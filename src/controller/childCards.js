const { ParentCards, ChildCards, cardRelations } = require("../../models");
const joi = require("joi");

exports.read = async (req, res) => {
  try {
    const loadChildCards = await ChildCards.findAll({
      include: {
        model: ParentCards,
        as: "parent",
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
      message: "Child cards has successfully Loaded",
      data: { loadChildCards },
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
exports.readStatus = async (req, res) => {
  try {
    const { status, parentId } = req.params;
    const loadChildCards = await ChildCards.findAll({
      include: {
        model: ParentCards,
        as: "parent",
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
      where: { status, parentId },
    });
    res.status(200).send({
      message: `Child card with status: ${status} and parentId: ${parentId} has successfully Loaded`,
      data: { loadChildCards },
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
    const findChildCards = await ChildCards.findOne({
      include: {
        model: ParentCards,
        as: "parent",
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
    if (!findChildCards) {
      return res.status(400).send({
        message: `There is no child card with id :${id}`,
      });
    }
    res.status(200).send({
      message: `Child card with id: ${id} has successfully Loaded`,
      data: { findChildCards },
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
    const { title, description, status, parentId } = req.body;
    const schema = joi.object({
      title: joi.string().required(),
      description: joi.string().allow(null, ""),
      status: joi.string().required(),
      parentId: joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }
    let creatChildCard = [];
    if (!req.file) {
      creatChildCard = await ChildCards.create({
        ...req.body,
      });
    } else {
      creatChildCard = await ChildCards.create({
        ...req.body,
        thumbnailChildCard: req.file.filename,
      });
    }
    res.status(200).send({
      message: "New child card has successfully created",
      data: { creatChildCard },
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
    const findChildCard = await ChildCards.findOne({
      where: { id },
    });
    if (!findChildCard) {
      return res.status(400).send({
        message: `There is no child card with id :${id}`,
      });
    }
    await ChildCards.destroy({
      where: { id },
    });
    res.status(200).send({
      message: `Child card with id: ${id} has successfully deleted`,
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
    const findChildCard = await ChildCards.findOne({
      where: { id },
    });
    if (!findChildCard) {
      return res.status(400).send({
        message: `There is no child card with id :${id}`,
      });
    }
    const body = req.body;
    await ChildCards.update(
      {
        title: body.title,
        description: body.description,
        status: body.status,
      },
      { where: { id } }
    );
    res.status(200).send({
      message: `Child Card with id: ${id} has successfully updated`,
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
    const [updated] = await ChildCards.update(
      {
        thumbnailChildCard: req.file.filename,
      },
      { where: { id } }
    );
    if (!updated) {
      return res.status(404).send({
        status: "fail",
        message: `There is no child card with id:${id}`,
        code: 404,
      });
    }
    res.send({
      status: "success",
      message: `User updated successfully`,
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
