import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wasteItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Waste'
  }],
  scheduledDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  totalWeight: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  collectionNotes: {
    type: String
  },
  driverAssigned: {
    type: String
  },
  vehicleInfo: {
    type: String
  }
}, {
  timestamps: true
});

const Pickup = mongoose.model('Pickup', pickupSchema);

export default Pickup;