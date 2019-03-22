const express = require("express");
const actionsDB = require("../data/helpers/actionModel");

const router = express.Router();

// GET
router.get("/", async (req, res) => {
  try {
    const actions = await actionsDB.get(); // get actions
    res.status(200).json(actions);  // OK
  } catch (error) { // catch all
    res.status(500).json({ errorMessage: "The action could not be retrieved from the database." });
  }
});

// GET :id
router.get("/api/actions/:id", async (req, res) => {
  try {
    actionsDB
    .get()
    .then(actions => {
      const { id } = req.params;
      const action = actions.find(action => `${action.id}` === id);
      if (!action) {
        return res.status(404).json({ errorMessage: "action not found." });
      }
      actionsDB  
        .get(id)
        .then(action => {
          res.status(200).json(action);  // OK
        })
        .catch(error => {
          res.status(500).json({ errorMessage: "The action could not be retrieved from the database." }); 
        });
    });
  } catch (error) {
    res.status(500).json({ errorMessage: "The action could not be retrieved from the database." });
  }
});

// POST
router.post("/api/actions/", async (req, res) => {
  const actionData = req.body;
  console.log(req.body);
  if (!actionData.description || !actionData.notes || !actionData.project_id) {
    res.status(400).json({ errorMessage: "Please provide a Project ID, description and notes for this action." });
  } else {
    try {
      const newAction = await actionsDB.insert(actionData);
      res.status(201).json(newAction);
    } catch (error) {
      res.status(500).json({ errorMessage: "The action could not be saved to the database." });
    }
  }
});

// DELETE :id
router.delete("/api/actions/:id", (req, res) => {
  const { id } = req.params;
  actionsDB
    .remove(id)
    .then(deletedAction => {
      deletedAction
        ? res.status(202).json({ errorMessage: "The action has been deleted." })
        : res.status(404).json({ errorMessage: "A project with this ID does not exist." });
    })
    .catch(err => {
      res.status(500).json({ error: "The action could not be removed." });
    });
});

// PUT :id
router.put("/api/actions/:id", async (req, res) => {
  try {
    actionsDB.get().then(actions => {
      const { id } = req.params;
      const changes = req.body;
      const action = actions.find(action => `${action.id}` === id);

      if (!action) {
        return res.status(404).json({ errorMessage: "This action is not found." });
      } else {
        actionsDB.update(id, changes);
        res.status(200).json({ errorMessage: "This action has been udpated." });
      }
    });
  } catch (error) {
    res.status(500).json({ errorMessage: "The action could not be retrieved from the database." });
  }
});

module.exports = router;
