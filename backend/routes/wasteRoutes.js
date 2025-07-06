import express from 'express';
import Waste from '../models/Waste.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create a new waste record
// @route   POST /api/waste
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { type, description, weight, items, notes } = req.body;

    const waste = new Waste({
      vendor: req.user._id,
      type,
      description,
      weight,
      items,
      notes
    });

    const createdWaste = await waste.save();
    res.status(201).json(createdWaste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all waste records for a vendor
// @route   GET /api/waste
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const waste = await Waste.find({ vendor: req.user._id }).sort({ createdAt: -1 });
    res.json(waste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get a waste record by ID
// @route   GET /api/waste/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id);
    
    if (waste && waste.vendor.toString() === req.user._id.toString()) {
      res.json(waste);
    } else {
      res.status(404).json({ message: 'Waste record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a waste record
// @route   PUT /api/waste/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { type, description, weight, items, status, notes } = req.body;
    
    const waste = await Waste.findById(req.params.id);
    
    if (waste && waste.vendor.toString() === req.user._id.toString()) {
      waste.type = type || waste.type;
      waste.description = description || waste.description;
      waste.weight = weight || waste.weight;
      waste.items = items || waste.items;
      waste.status = status || waste.status;
      waste.notes = notes || waste.notes;
      
      const updatedWaste = await waste.save();
      res.json(updatedWaste);
    } else {
      res.status(404).json({ message: 'Waste record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a waste record
// @route   DELETE /api/waste/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id);
    
    if (waste && waste.vendor.toString() === req.user._id.toString()) {
      await waste.deleteOne();
      res.json({ message: 'Waste record removed' });
    } else {
      res.status(404).json({ message: 'Waste record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get waste statistics
// @route   GET /api/waste/stats/total
// @access  Private
router.get('/stats/total', protect, async (req, res) => {
  try {
    const totalStats = await Waste.aggregate([
      { $match: { vendor: req.user._id } },
      { $group: {
          _id: "$type",
          totalWeight: { $sum: "$weight" },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(totalStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;