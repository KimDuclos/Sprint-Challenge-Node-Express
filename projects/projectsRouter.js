const express = require('express');
const projectDb = require('../data/helpers/projectModel');

const router = express.Router();

//endpoints

// GET
router.get('/', async (req, res) => {
  try {
    const projects = await projectDb.get();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ errorMessage: 'The project could not be retrieved from the database.'});
  }
});

//GET :id
router.get('/api/projects/:id', async (req, res) => {
  try {
    projectDb
    .get()
    .then(projects => {
      const { id } = req.params;
      const project = projects.find(project => `${project.id}` === id);

      if (!project) {
        return res.status(404).json({ errorMessage: 'Project is not found.' });
      }

      projectDb
        .get(id)
        .then(project => {
          res.status(200).json(project);
        })
        .catch(error => {
          res.status(500).json({ errorMessage: 'The project could not be retrieved from the database' });
        });
    });
  } catch (error) {
    res.status(500).json({ errorMessage: 'The project could not be retrieved from the database', error: error });
  }
});

// GET :id
router.get('/api/projects/actions/:id', async (req, res) => {
  try {
    projectDb
    .get()
    .then(projects => {
      const { id } = req.params;
      const project = projects.find(project => `${project.id}` === id);

      if (!project) {
        // uncomment below for a boring ol' regular status code
        // return res.status(404).json({ errorMessage: 'Project not found' }); 
        return res.redirect('http://m404.ytmnd.com/') // vintage easter egg just because I wanted to try something different (pssst will not be as fun in PostMan)
      }
      projectDb
        .getProjectActions(id)
        .then(actions => {
          res.status(200).json(actions);
        })
        .catch(error => {
          res.status(500).json({ errorMessage: 'Project actions could not be retrieved from database.' });
        });
    });
  } catch (error) {
    res.status(500).json({ errorMessage: 'The project actions could not be retrieved from the database.' });
  }
});

// POST
router.post('/api/projects/', async (req, res) => {
  const projectData = req.body;
  console.log(req.body);
  if (!projectData.name || !projectData.description) {
    res.status(400).json({ errorMessage: 'Please provide a name and a description for the project.' });
  } else {
    try {
      const newProject = await projectDb.insert(projectData);
      res.status(201).json(newProject);
    } catch (error) {
      res
        .status(500)
        .json({ errorMessage: 'The project could not be retrieved from the database.' });
    }
  }
});


// DELETE :id
router.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  projectDb
    .remove(id)
    .then(deletedProject => {
      deletedProject
        ? res.status(202).json({ errorMessage: 'Project has been deleted.' })
        : res.status(404).json({ errorMessage: 'A project with this ID does not exist.' });
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'This project could not be deleted.' });
    });
});


// PUT :id
router.put('/api/projects/:id', async (req, res) => {
  try {
    projectDb
    .get()
    .then(projects => {
      const { id } = req.params;
      const changes = req.body;
      const project = projects.find(project => `${project.id}` === id);

      if (!project) {
        return res.status(404).json({ errorMessage: 'Project is not found.' });
      } else {
        projectDb.update(id, changes);
        res.status(200).json({ errorMessage: 'The project has been updated.' });
      }
    });
  } catch (error) {
    res.status(500).json({ errorMessage: 'The project could not be retrieved from the database.' });
  }
});

module.exports = router;
