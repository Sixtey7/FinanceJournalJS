var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var AccountSchema = new Schema({
    name : String,
    dateCreate : {
        type : Date,
        default : Date.now
    },
    notes : String
});

/* Virtual property that we'll use to hold the calculated balance */
AccountSchema.virtual('balance')
    .get (function() {
        return this.__balance;
    })
    .set (function(balance) {
        this.__balance = balance;
    });

AccountSchema.set('toJSON', { getters: true, virtuals: true});

mongoose.model('Account', AccountSchema);