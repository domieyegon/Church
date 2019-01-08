const mongoose=require('mongoose');
const Schema= mongoose.Schema;

const BibleSchema= new Schema({
 title: {
     type: String,
     required: true
 },

 content: {
     type: String,
     required: true
 },
    user: {
      type: Schema.Types.ObjectId,
        ref: 'users'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('bible', BibleSchema, 'bible');