var Situation = require('../models/situation');
var config = require('../config/database');

var functions = {

  webapp : function (req, res){
    console.log("lat",req.params.lat);
    console.log("lng",req.params.lng);
    var ResData;
    Situation.find( { aedLat : req.params.lat, aedLng : req.params.lng },function(err,data){
      if(err){
          res.send("환자가 없습니다.");
          console.log("err");
      }
      if(data[0]){
        console.log("tttt",data[0]);
        ResData = data[0];
        res.cookie("aedLat", req.params.lat);
        res.cookie("lat", ResData.patientLat );
        res.cookie("lng", ResData.patientLng );
        res.cookie("address",encodeURIComponent(ResData.address) );
        res.redirect('../../rescuePart/mobileweb.html');
      }else{
        console.log("faile get situation")
        res.send("환자가 없습니다.");
      }


    });


  }

};

module.exports = functions;
