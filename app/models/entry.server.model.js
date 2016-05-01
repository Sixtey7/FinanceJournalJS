var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var EntrySchema = new Schema({
  source : String,
  amount : Number,
  date : {
    type : Date,
    default : Date.now
    //TODO: May want to add a setter in here to zero out the Time
  },
  estimate : Boolean,
  notes : String
});

/* Virtual property that we'll use to hold the calculated balance */
EntrySchema.virtual('balance')
  .get(function() {
    return this.__balance;
  })
  .set(function(balance) {
    this.__balance = balance;
  });

EntrySchema.set('toJSON', { getters: true, virtuals: true });

mongoose.model('Entry', EntrySchema);
