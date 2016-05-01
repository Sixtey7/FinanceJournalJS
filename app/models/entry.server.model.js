var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var EntrySchema = new Schema({
  source : String,
  amount : Number,
  date : {
    type : Date,
    default : Date.now
  },
  estimate : Boolean,
  notes : String
});

mongoose.model('Entry', EntrySchema);
