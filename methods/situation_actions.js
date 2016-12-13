var request = require('request');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var Situation = require('../models/situation');
var socket_actions = require('../methods/socket_actions')

var functions = {

  addPatient : function (req, res){
    console.log("req lat",req.body.lat);
    console.log("req lon",req.body.lon);
    var latParam = req.body.lat;
    var lngParam = req.body.lon;

    var mykey = "=ad3ed1e475a6f53a39bc02d9b4b95584"; //local key
    //var mykey = "=ad3ed1e475a6f53a39bc02d9b4b95584";//server key
    var url = ' https://apis.daum.net/local/geo/coord2detailaddr';
    var queryParams = '?' + encodeURIComponent('apikey') + mykey;
    queryParams += '&' + encodeURIComponent('x') + '=' + encodeURIComponent(lngParam); // 좌표(경도)
    queryParams += '&' + encodeURIComponent('y') + '=' + encodeURIComponent(latParam); // 좌표(위도)
    queryParams += '&inputCoordSystem=WGS84';
    var extractXml;
    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
          parser.parseString( body , function(err, result){
            extractXml = result.address;
            console.log("ex",extractXml.old[0].name[0].$);
            //console.log("req",req.body.lat);
            if(extractXml !== undefined){
              res.json({ lat : latParam, lng : lngParam, address : extractXml.old[0].name[0].$.value });
            }
            else{
              res.json({ lat : req.body.lat, lng : req.body.lon });
            }

         });
    });

  //  console.log("extract", extractXml);
     //res.json({ lat : req.body.lat, lng : req.body.lon });
  },
//------------End addPatient---------------
  getAedList : function ( req, res ){
    console.log("req2 lat",req.query.lat);
    console.log("req2 lon",req.query.lng);
    var latParam = req.query.lat;
    var lngParam = req.query.lng;

    var serviceKey = 'sOeLXw%2B0H2SQr5smAbXhw2Q%2FK6SbySO0oS49h2OW1n4BjyHGRm%2FrXP3DT6n1cywpwCBOYkp92tK3C9FhZEw4YA%3D%3D';
    var url = 'http://openapi.e-gen.or.kr/openapi/service/rest/AEDInfoInqireService/getAedLcinfoInqire';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + serviceKey;
        queryParams += '&' + encodeURIComponent('WGS84_LON') + '=' + encodeURIComponent(lngParam);
        queryParams += '&' + encodeURIComponent('WGS84_LAT') + '=' + encodeURIComponent(latParam);
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');

    var extractXml;
    console.log("url:",url+queryParams);
    request({
        url: url + queryParams,
        method: 'GET'
        }, function (error, response, body) {
             parser.parseString( body , function(err, result){
             extractXml = result.response;
             console.log("aed info",extractXml.body );
             //console.log("req",req.body.lat);
             if(extractXml !== undefined){
                res.json({ lat : latParam, lng : lngParam, lists : extractXml.body });
             }
             else{
                res.json({ lat : req.body.lat, lng : req.body.lon });
            }
        });
    });

  },

  addDB : function ( req, res ){
    console.log("addDB: req",req.body.aedLat);
    console.log("addDB: req",req.body.aedLng);
    console.log("addDB: req",req.body.patientLat);
    console.log("addDB: req",req.body.patientLng);
    console.log("addDB: req",req.body.address);
    socket_actions.toAndroid();
    
    var newSituation = Situation({
          aedLat: req.body.aedLat,
          aedLng: req.body.aedLng,
          patientLat: req.body.patientLat,
          patientLng: req.body.patientLng,
          address : req.body.address
      });

    newSituation.save(function(err, newSituation){
        if (err){
            console.log('roomerr',err);
            res.json({success:false, msg:'Failed to save'})
        }
        else {
            res.json({success:true, msg:'Successfully saved'});
        }
    });
  },

  removeDB : function ( req, res ){
    var aedLat = req.body.aedLat;
    var aedLng =req.body.aedLng;


    var newSituation = Situation({
          aedLat: req.body.aedLat,
          aedLng: req.body.aedLng
      });
    var situation = Situation.find({'aedLat': aedLat});
    situation.remove(function(err){
        if (err){
            res.json({success:false, msg:'Failed to save'})
        }
          res.json({success:true, msg:'Successfully remove'});
    });
  }

};

module.exports = functions;
