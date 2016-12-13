var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var SituationSchema= new Schema({
  aedLat : {
      type: String,
      required: true
    },
  aedLng : {
      type: String,
      required: true
    },
  patientLat : {
      type: String,
      required: true
    },
  patientLng : {
    type: String,
    required: true
  },
  address : {
    type: String,
  }
});

module.exports=mongoose.model('Situation', SituationSchema);
