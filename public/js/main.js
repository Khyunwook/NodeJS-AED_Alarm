var $latoutput = $("#latOutput"),
    $lngoutput = $("#lngOutput"),
    $addroutput = $("#addrOutput"),
    $aedli = $("#aedli"),
    $send_signal = $("#send_signal"),
    $addroutput2 = $("#addrOutput2"),
    $mymsg = $("#myMsg"),
    $occur_time = $("#occur_time"),
    $flow_time = $("#flow_time");

var global_lat="35.890235",
    global_lng="128.611328",
    global_map,
    patient_time,
    pa_hour, pa_min, pa_sec,
    sec=0,min=0,
    HOME_PATH;


var aedObj;
var patientObj;

var socket = io().connect('http://localhost:3000');

var setTime = function(){
  patient_time = new Date();
  pa_hour = patient_time.getHours();
  pa_min = patient_time.getMinutes();
  pa_sec = patient_time.getSeconds();
  console.log("time",patient_time);
  $occur_time.append(pa_hour + "시" + pa_min + "분" + pa_sec +"초");
}
var printTime = function(){
  sec++;
  if(sec>=60){
    min++;
    sec=0;
  }
  $flow_time.empty();
  $flow_time.append(leadingZeros(min, 2) + ':'+leadingZeros(sec, 2) );
  setTimeout("printTime()", 1000);
}

var initMap = function(flag){
    HOME_PATH = window.HOME_PATH || '.';
    var position = new naver.maps.LatLng(global_lat, global_lng);

    global_map = new naver.maps.Map('map1', {
      center: position,
      zoom: 10
    });

    var markerOptions = {
      position: position.destinationPoint(90, 15),
      map: global_map,
      icon: {
        url: HOME_PATH +'/images/aed_patient.png',
        size: new naver.maps.Size(50, 39),
        origin: new naver.maps.Point(0, 0),
        anchor: new naver.maps.Point(25, 26)
      }
    };
    if(flag){
      var marker = new naver.maps.Marker(markerOptions);
    }


};

var initMapMarker = function( latlnglists ){
  var markers = []
      ,infoWindows = [];

//--------temp 9호관---------

//--------temp 9호관---------

  for(var i=0; i<latlnglists.length; i++){
      var lat = latlnglists[i].wgs84Lat[0];
      var lng = latlnglists[i].wgs84Lon[0];
      console.log("maplat",latlnglists[i].wgs84Lat);
      console.log("maplng",latlnglists[i].wgs84Lon);
      var position= new naver.maps.LatLng(lat, lng);
      console.log("mapposition",position);

      var markerOptions = {
        position: position,
        map: global_map,
        icon: {
            url: HOME_PATH +'/images/aed_icon.png',
            size: new naver.maps.Size(50, 52),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(25, 26)
        }
      };

      var marker = new naver.maps.Marker(markerOptions);
      var contentString = [
        '<div class="iw_inner">',
        '   <h3>알림전송</h3>',
        '   <h4>'+(i+1)+'. '+latlnglists[i].buildAddress+' '+latlnglists[i].buildPlace +'<br>거리:'+latlnglists[i].distance*1000 +'M </div>',
        '   <button type ="submit" onclick="Alarm_send('+i+');" class="btn btn-default">알림 전송</button>',
        '   <button type ="submit" onclick="Alarm_stop('+i+');" class="btn btn-default">알림 취소</button>',
        '</div>'
      ].join('');

      var infowindow = new naver.maps.InfoWindow({
        content: contentString
      });

      markers.push(marker);
      infoWindows.push(infowindow);
    };
    naver.maps.Event.addListener(global_map, 'idle', function() {
      updateMarkers(global_map, markers);
    });

    function updateMarkers(map, markers) {

          var mapBounds = map.getBounds();
          var marker, position;

          for (var i = 0; i < markers.length; i++) {

              marker = markers[i]
              position = marker.getPosition();

              if (mapBounds.hasLatLng(position)) {
                  showMarker(global_map, marker);
              } else {
                  hideMarker(global_map, marker);
              }
          }
      }

      function showMarker(map, marker) {

          if (marker.setMap()) return;
          marker.setMap(map);
      }

      function hideMarker(map, marker) {

          if (!marker.setMap()) return;
          marker.setMap(null);
      }

      // 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
      function getClickHandler(seq) {
          return function(e) {
              var marker = markers[seq],
                  infoWindow = infoWindows[seq];

              if (infoWindow.getMap()) {
                  infoWindow.close();
              } else {
                  infoWindow.open(global_map, marker);
              }
          }
      }

      for (var i=0, ii=markers.length; i<ii; i++) {
          naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
      }

};

var initAedList= function(lat, lng){
      $.ajax({
          url: 'situation/getAedList',
          type : 'GET',
          data : {lat : global_lat, lng : global_lng},
          success: function( res ){
              var dataObj = res.lists[0].items[0].item;
              aedObj=dataObj;
              console.log("address:",dataObj);
              console.log("AedObj :",aedObj);
              initMapMarker(dataObj);
              for(var i=0; i<dataObj.length; i++){
                $aedli.append('<a href="#" class="list-group-item" id="'+dataObj[i].wgs84Lat+'">'+(i+1)+'. '+dataObj[i].buildAddress+' '+dataObj[i].buildPlace +'<br>거리:'+dataObj[i].distance*1000 +'M </div>');
                $aedli.append('   <button type ="submit" onclick="Alarm_send('+i+');" class="btn btn-default">알림 전송</button>',
                              '   <button type ="submit" onclick="Alarm_stop('+i+');" class="btn btn-default">알림 취소</button>' );
              }

          }
      });
};

initMap(false);


function Alarm_send (id){
      console.log('sendAed',id);
      console.log("Alarm_sed AedObj",aedObj);
      console.log("Alarm_sed PatientObj",patientObj);
      var aedlat = aedObj[id].wgs84Lat[0].substring(0,11);
      var aedlng = aedObj[id].wgs84Lon[0].substring(0,11);
      sock_join_room(aedlat, aedlng);
      console.log("aedlat",aedlat);
     $.ajax({
         url: 'situation/addDB',
         type : 'POST',
         data : { aedLat : aedlat, aedLng : aedlng, patientLat : patientObj.lat, patientLng : patientObj.lng, address : patientObj.address },
         success: function( res ){
            console.log("aedsendres",res);
            alert("알람전송이 완료되었습니다.");
	 }
     });
};

function Alarm_stop (id){
     console.log('sendAed',id);
     console.log("Alarm_sed AedObj",aedObj);
     console.log("Alarm_sed PatientObj",patientObj);
     var aedlat = aedObj[id].wgs84Lat[0].substring(0,11);
     var aedlng = aedObj[id].wgs84Lon[0].substring(0,11);
     sock_exit_room(aedlat, aedlng)
     console.log("aedlat",aedlat);
    $.ajax({
        url: 'situation/removeDB',
        type : 'DELETE',
        data : { aedLat : aedlat, aedLng : aedlng},
        success: function( res ){
           console.log("aedsendres",res);
        }
    });
};

(function($){
   function processForm( e ){
          $.ajax({
           url: '/situation/addPatient',
           dataType: 'text',
           type: 'post',
           contentType: 'application/x-www-form-urlencoded',
           data: $(this).serialize(),
           success: function( data, textStatus, jQxhr ){
              var dataObj = JSON.parse(data);
               console.log('data',dataObj);
               patientObj = dataObj;
               console.log('recv patientObj',patientObj);
               global_lat = dataObj.lat;
               global_lng = dataObj.lng;
               $latoutput.append(dataObj.lat);
               $lngoutput.append(dataObj.lng);
               $addroutput.append(dataObj.address);
               setTime();
               printTime();
               initMap(true);
               initAedList(global_lat, global_lng);
               //xmlrequest(global_lat,global_lng);
           },
           error: function( jqXhr, textStatus, errorThrown ){
               console.log( errorThrown );
           }
       });

       e.preventDefault();
     }

     $('#addPatient').submit( processForm );
})(jQuery);


$('#addrUpdate').click(function(){
  var newAddr = $('#addrbox').val();
  console.log("addroutput2",$addroutput2);
  console.log("addupdate",newAddr);
  $addroutput2.empty();
  $addroutput2.append(newAddr);
  socket.emit('from119addr',{ addAddr: newAddr });
  $('#addrbox').val('');
});

$('#addMsg').click(function(){
  var newMsg = $('#msgbox').val();
  $mymsg.append('<BR>'+newMsg);
  socket.emit('from119msg',{ addMsg : newMsg });
  $('#msgbox').val('');
});


function sock_join_room (aedlat, aedlng){
    socket.emit('joinroom',{room: aedlat});
};

function sock_exit_room(aedlat, aedlng){
    socket.emit('exitroom', {room: aedlat});
};

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (var i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}
