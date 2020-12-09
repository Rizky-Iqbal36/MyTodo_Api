const { ParentCards, cardRelations, Users } = require("../../models");

exports.read = async (req, res) => {
  try {
    const loadUsers = await Users.findAll({
      include: {
        model: ParentCards,
        as: "parentCards",
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
      message: "Users data successfully Loaded",
      data: { loadUsers },
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

exports.detail = async (req, res) => {
  try {
    const { id } = req.params;

    const checkUser = await Users.findOne({
      where: {
        id,
      },
    });

    if (!checkUser) {
      return res.status(400).send({
        message: `There is no user with id :${id}`,
      });
    }

    const user = await Users.findOne({
      where: {
        id,
      },
      include: {
        model: ParentCards,
        as: "parentCards",
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
      message: "Users data has successfully loaded",
      data: { user },
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

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const checkUser = await Users.findOne({
      where: {
        id,
      },
    });

    if (!checkUser) {
      return res.status(400).send({
        message: `There is no user with id :${id}`,
      });
    }

    const [updated] = await Users.update(
      {
        avatar: req.file.filename,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!updated)
      return res.status(404).send({
        status: "fail",
        message: "User not found!",
        code: 404,
      });

    const data = await Users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      message: `User updated successfully`,
      data,
      path: req.file.path,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
      code: 500,
    });
  }
};
