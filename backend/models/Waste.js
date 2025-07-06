import mongoose from 'mongoose';

const wasteSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['rotten', 'reusable'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    weight: { type: Number, required: true }
  }],
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'collected', 'processed'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const Waste = mongoose.model('Waste', wasteSchema);

export default Waste;