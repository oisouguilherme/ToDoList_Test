const express = require('express');
const router = express.Router();
const { Task } = require('./models');

router.post('/tasks', async (req, res) => {
  try {
    const { description, completed, completionDate } = req.body;
    const task = await Task.create({ description, completed, completionDate });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed, completionDate } = req.body;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    task.description = description;
    task.completed = completed;
    task.completionDate = completionDate;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
