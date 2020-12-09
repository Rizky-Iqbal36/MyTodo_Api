const { cardRelations } = require("../../models");

exports.read = async (req, res) => {
  try {
    const loadRelations = await cardRelations.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send({
      message: "Relation successfully loaded",
      data: { loadRelations },
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
    const { UserId, ParentCardId, ChildCardId } = req.body;
    const checkRelation = await cardRelations.findOne({
      where: {
        UserId,
        ParentCardId,
        ChildCardId,
      },
    });
    if (checkRelation) {
      return res.status(400).send({
        message: `Relation between UserId: ${UserId}, ParentCardId: ${ParentCardId} and ChildCardId: ${ChildCardId} is already exist`,
      });
    }

    const createRelation = await cardRelations.create({ ...req.body });
    res.status(200).send({
      message: "New relation has successfully created",
      data: {
        createRelation,
      },
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
    const { UserId, ParentCardId, ChildCardId } = req.params;
    const checkRelation = await cardRelations.findOne({
      where: {
        UserId,
        ParentCardId,
        ChildCardId,
      },
    });
    if (!checkRelation) {
      return res.status(400).send({
        message: `There is no relation between UserId: ${UserId}, ParentCardId: ${ParentCardId} and ChildCardId: ${ChildCardId} is already exist`,
      });
    }
    await cardRelations.destroy({
      where: {
        UserId,
        ParentCardId,
        ChildCardId,
      },
    });
    res.status(400).send({
      message: `Relation between UserId: ${UserId}, ParentCardId: ${ParentCardId} and ChildCardId: ${ChildCardId} has successfully deleted`,
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
