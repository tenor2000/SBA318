import express from "express";
import getModelsFromDirectory from "../utilityFuncs/getModelsFromDirectory.mjs";
import error from "../utilityFuncs/error.mjs";

const router = express.Router();

// api/warbands/

router.route("/").get(async (req, res, next) => {
  const type = req.query.type || null;
  let warbandData = {};
  try {
    if (type) {
      const Model = await getModelsFromDirectory("warband", type);
      warbandData = await Model.find();
    } else {
      const warbandModels = await getModelsFromDirectory("warband");
      for (const [key, value] of Object.entries(warbandModels)) {
        warbandData[key + "_data"] = await value.find();
      }
    }
    warbandData ? res.json(warbandData) : next(error(404, "No Data Found"));
  } catch (err) {
    console.error(`Error retrieving data:`, err);
    res.status(500).json({ status: 500, error: err.message, details: err });
  }
});

// Get all wizards with attached apprentice and followers belonging to User
router.route("/user/:user_id").get(async (req, res, next) => {
  try {
    const wizardModel = await getModelsFromDirectory("warband", "wizard");
    const wizardsArray = await wizardModel
      .find({ user_id: req.params.user_id })
      .populate("apprentices")
      .populate("followers");

    wizardsArray.length > 0
      ? res.json(wizardsArray)
      : next(error(404, "No Data Found"));
  } catch (err) {
    console.error(`Error retrieving data:`, err);
    res.status(500).json({ status: 500, error: err.message, details: err });
  }
});

router.route("/warband").get(async (req, res, next) => {
  // Get all warband info in one object by wizard
  const id = req.query.id || null;

  if (!id) {
    return res.status(400).json({ error: "No id provided" });
  }

  try {
    const Model = await getModelsFromDirectory("warband", "wizard");
    let warbandData = await Model.findById(id)
      .populate("apprentices")
      .populate("followers");

    warbandData ? res.json(warbandData) : next(error(404, "No Data Found"));
  } catch (err) {
    console.error(`Error retrieving data:`, err);
    res.status(500).json({ status: 500, error: err.message, details: err });
  }
});

router.route("/warband/:id").get(async (req, res, next) => {
  // Get all warband info in one object by wizard
  const id = req.params.id || null;
  try {
    const Model = await getModelsFromDirectory("warband", "wizard");
    let warbandData = await Model.findById(id)
      .populate("apprentices")
      .populate("followers");

    warbandData ? res.json(warbandData) : next(error(404, "No Data Found"));
  } catch (err) {
    console.error(`Error retrieving data:`, err);
    res.status(500).json({ status: 500, error: err.message, details: err });
  }
});

router
  .route("/:type")
  .get(async (req, res, next) => {
    const queryId = req.query.id || null;
    const type = req.params.type.endsWith("s")
      ? req.params.type.slice(0, -1)
      : req.params.type;

    try {
      const Model = await getModelsFromDirectory("warband", type);
      let data;

      if (queryId) {
        data =
          type === "wizard"
            ? await Model.findById(queryId) // return a single wizard object
            : await Model.find({ wizard_id: queryId }); // returns array of non wizard objects
      } else {
        data = await Model.find();
      }

      data ? res.json(data) : next(error(404, "No Data Found"));
    } catch (err) {
      console.error(`Error retrieving ${type}:`, err);
      res.status(500).json({ status: 500, error: err.message, details: err });
    }
  })
  .post(async (req, res, next) => {
    const type = req.params.type.endsWith("s")
      ? req.params.type.slice(0, -1)
      : req.params.type;
    const models = await getModelsFromDirectory("warband");
    const Model = models[type];
    const formData = req.body;

    if (!Model) {
      return res
        .status(404)
        .json({ error: `No model found for type: ${req.params.type}` });
    }

    try {
      const result = await Model.create(formData);
      console.log(`Status 201: Creation Successful`);
      res.status(201).json(result);
    } catch (err) {
      console.error(`Error inserting ${type}:`, err);
      res.status(500).json({ error: err.message, details: err });
    }
  });

router.route("/wizards/:id/:type").get(async (req, res, next) => {
  const id = req.params.id;
  let type = req.params.type;
  type.endsWith("s") ? (type = type.slice(0, -1)) : type;
  const Model = await getModelsFromDirectory("warband", type);

  if (!Model) {
    return res
      .status(404)
      .json({ error: `No model found for type: ${req.params.type}` });
  }

  try {
    const data = await Model.find({ wizard_id: id });
    data ? res.json(data) : next(error(404, "No Data Found"));
  } catch (err) {
    console.error(`Error retrieving data:`, err);
    res.status(500).json({ status: 500, error: err.message, details: err });
  }
});

router
  .route("/:type/:id")
  .get(async (req, res, next) => {
    const id = req.params.id;
    const type = req.params.type.endsWith("s")
      ? req.params.type.slice(0, -1)
      : req.params.type;

    try {
      const Model = await getModelsFromDirectory("warband", type);
      let data = await Model.findById(id);

      data ? res.json(data) : next(error(404, "No Data Found"));
    } catch (err) {
      console.error(`Error retrieving ${type}:`, err);
      res.status(500).json({ status: 500, error: err.message, details: err });
    }
  })
  .put(async (req, res, next) => {
    const type = req.params.type.endsWith("s")
      ? req.params.type.slice(0, -1)
      : req.params.type;
    const Model = await getModelsFromDirectory("warband", type);
    const formData = req.body;

    if (!Model) {
      return res
        .status(404)
        .json({ error: `No model found for type: ${req.params.type}` });
    }

    try {
      const changedDoc = await Model.findByIdAndUpdate(
        req.params.id,
        formData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!changedDoc) {
        return res.status(404).json({ error: "Document not found" });
      }

      console.log(`Status 200: Update Successful - ID: ${req.params._id}`);
      res.status(200).json(changedDoc);
    } catch (err) {
      console.error(`Error updating ${type}:`, err);
      res.status(500).json({ error: err.message, details: err });
    }
  })
  .delete(async (req, res, next) => {
    const id = req.params.id;
    const type = req.params.type.endsWith("s")
      ? req.params.type.slice(0, -1)
      : req.params.type;
    const models = await getModelsFromDirectory("warband");
    const Model = models[type];

    if (!Model) {
      return res
        .status(404)
        .json({ error: `No model found for type: ${req.params.type}` });
    }

    try {
      const deletedDoc = await Model.findByIdAndDelete(id);

      if (!deletedDoc) {
        console.log(`Status 404: Deletion Failed - ID: ${id}`);
        return res.status(404).json({ error: "Document not found" });
      }

      console.log(`Status 204: Deletion Successful - ID: ${id}`);
      res.status(204);
    } catch (err) {
      console.error(`Error updating ${type}:`, err);
      res.status(500).json({ error: err.message, details: err });
    }
  });

export default router;
