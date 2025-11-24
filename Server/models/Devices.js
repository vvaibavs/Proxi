const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  deviceName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Online', 'Offline', 'Maintenance'],
    default: 'Offline'
  },
  screenTime: {
    type: Number,
    default: 645
  }
}, {
  timestamps: true
});

// Export both the schema and the model
module.exports = deviceSchema;
module.exports.Device = mongoose.model('Device', deviceSchema);
