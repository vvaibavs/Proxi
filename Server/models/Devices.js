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
  deviceType: {
    type: String,
    enum: ['Temperature', 'Humidity', 'Irrigation', 'Lighting', 'Soil', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Online', 'Offline', 'Maintenance'],
    default: 'Offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    default: 'Unknown'
  },
  settings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Export both the schema and the model
module.exports = deviceSchema;
module.exports.Device = mongoose.model('Device', deviceSchema);
