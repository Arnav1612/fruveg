import express from 'express';
import Pickup from '../models/Pickup.js';
import Waste from '../models/Waste.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Schedule a new pickup
// @route   POST /api/pickups
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { wasteItems, scheduledDate, timeSlot, collectionNotes } = req.body;
    
    // Calculate total weight
    let totalWeight = 0;
    
    // Update each waste item status to scheduled
    if (wasteItems && wasteItems.length > 0) {
      for (const wasteId of wasteItems) {
        const waste = await Waste.findById(wasteId);
        
        if (waste && waste.vendor.toString() === req.user._id.toString()) {
          totalWeight += waste.weight;
          waste.status = 'scheduled';
          await waste.save();
        } else {
          return res.status(404).json({ message: 'One or more waste items not found' });
        }
      }
    } else {
      return res.status(400).json({ message: 'No waste items provided' });
    }
    
    const pickup = new Pickup({
      vendor: req.user._id,
      wasteItems,
      scheduledDate,
      timeSlot,
      totalWeight,
      collectionNotes
    });
    
    const createdPickup = await pickup.save();
    res.status(201).json(createdPickup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all pickups for a vendor
// @route   GET /api/pickups
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const pickups = await Pickup.find({ vendor: req.user._id })
                               .sort({ scheduledDate: 1 })
                               .populate('wasteItems');
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get pickup by ID
// @route   GET /api/pickups/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id).populate('wasteItems');
    
    if (pickup && pickup.vendor.toString() === req.user._id.toString()) {
      res.json(pickup);
    } else {
      res.status(404).json({ message: 'Pickup not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update pickup
// @route   PUT /api/pickups/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { scheduledDate, timeSlot, status, collectionNotes } = req.body;
    
    const pickup = await Pickup.findById(req.params.id);
    
    if (pickup && pickup.vendor.toString() === req.user._id.toString()) {
      pickup.scheduledDate = scheduledDate || pickup.scheduledDate;
      pickup.timeSlot = timeSlot || pickup.timeSlot;
      pickup.status = status || pickup.status;
      pickup.collectionNotes = collectionNotes || pickup.collectionNotes;
      
      // If status is changed to cancelled, update waste items
      if (status === 'cancelled') {
        for (const wasteId of pickup.wasteItems) {
          const waste = await Waste.findById(wasteId);
          if (waste) {
            waste.status = 'pending';
            await waste.save();
          }
        }
      }
      
      const updatedPickup = await pickup.save();
      res.json(updatedPickup);
    } else {
      res.status(404).json({ message: 'Pickup not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete pickup
// @route   DELETE /api/pickups/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    
    if (pickup && pickup.vendor.toString() === req.user._id.toString()) {
      // Update waste items status back to pending
      for (const wasteId of pickup.wasteItems) {
        const waste = await Waste.findById(wasteId);
        if (waste) {
          waste.status = 'pending';
          await waste.save();
        }
      }
      
      await pickup.deleteOne();
      res.json({ message: 'Pickup removed' });
    } else {
      res.status(404).json({ message: 'Pickup not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get upcoming pickups
// @route   GET /api/pickups/upcoming/list
// @access  Private
router.get('/upcoming/list', protect, async (req, res) => {
  try {
    const today = new Date();
    
    const upcomingPickups = await Pickup.find({
      vendor: req.user._id,
      scheduledDate: { $gte: today },
      status: { $ne: 'cancelled' }
    }).sort({ scheduledDate: 1 }).limit(5).populate('wasteItems');
    
    res.json(upcomingPickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;