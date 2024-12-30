const express = require('express');
const Scenario = require('../../models/Report/Scenario'); // Import Scenario model
const fetchuser = require('../../middleware/fetchuser');
const User = require('../../models/User');
const router = express.Router();

// Get all scenarios or filter by reportId
router.get('/:reportId', fetchuser, async (req, res) => {
  try {
    const { reportId } = req.params; // Optional filter by reportId
    const scenarios = await Scenario.find({ reportId });
    res.json(scenarios);
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({ error: 'Failed to fetch scenarios' });
  }
});

// Add a new scenario
router.post('/', fetchuser, async (req, res) => {
  try {
    const { scenarioId, reportId } = req.body;

    const userAdmin = await User.findById(req.user.id);

    if (userAdmin.role != process.env.WT) {
      return res.status(403).send({ error: "Bad Request" });
    }

    if (!scenarioId || !reportId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newScenario = new Scenario({ scenarioId, reportId });
    await newScenario.save();
    res.status(201).json({ message: 'Scenario added successfully', scenario: newScenario });
  } catch (error) {
    console.error('Error adding scenario:', error);
    res.status(500).json({ error: 'Failed to add scenario' });
  }
});

// Edit a scenario by ID
router.put('/:id', fetchuser, async (req, res) => {
  try {
    const { id } = req.params;
    const { scenarioId, reportId } = req.body;

    const userAdmin = await User.findById(req.user.id);

    if (userAdmin.role != process.env.WT) {
      return res.status(403).send({ error: "Bad Request" });
    }

    const updatedScenario = await Scenario.findByIdAndUpdate(
      id,
      { scenarioId, reportId },
      { new: true, runValidators: true } // Return updated document
    );

    if (!updatedScenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    res.json({ message: 'Scenario updated successfully', scenario: updatedScenario });
  } catch (error) {
    console.error('Error updating scenario:', error);
    res.status(500).json({ error: 'Failed to update scenario' });
  }
});

// Delete a scenario by ID
router.delete('/:id', fetchuser, async (req, res) => {
  try {
    const { id } = req.params;

    const userAdmin = await User.findById(req.user.id);

    if (userAdmin.role != process.env.WT) {
      return res.status(403).send({ error: "Bad Request" });
    }

    const deletedScenario = await Scenario.findByIdAndDelete(id);

    if (!deletedScenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    res.json({ message: 'Scenario deleted successfully', scenario: deletedScenario });
  } catch (error) {
    console.error('Error deleting scenario:', error);
    res.status(500).json({ error: 'Failed to delete scenario' });
  }
});

module.exports = router;
