var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var EntrySchema = new Schema({
  entry : Schema.ObjectId,
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
