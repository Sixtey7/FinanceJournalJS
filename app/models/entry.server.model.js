var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var EntrySchema = new Schema({
  source : String,
  amount : Number,
  date : {
    type : Date,
  },
  estimate : Boolean,
  notes : String
});

EntrySchema.pre('save', function(next) {
  if (!this.date) {
    this.date = Date.now();
  }
  this.date.setHours(0);
  this.date.setMinutes(0);
  this.date.setSeconds(0);
  this.date.setMilliseconds(0);
  next();
});

mongoose.model('Entry', EntrySchema);
