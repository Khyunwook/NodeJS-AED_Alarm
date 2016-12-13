var $pat_addr = $("#pat_addr"),
    $addroutput2 = $("#addrOutput2"),
    $mymsg = $("#myMsg");

var socket = io().connect('http://localhost:3000');

$(document).ready(function() {
		// Animate loader off screen
		$("#loading").fadeOut(3000);
	});
function loadMapScenario() {


                var cookies = document.cookie;
                console.log("data",cookies);
                var pat_lat = getCookie("lat");
                var pat_lng = getCookie("lng");
                var aed_lat = getCookie("aedLat");
                var pat_addr ="대구 북구 산격동 1370-1";
                $pat_addr.text(pat_addr);

                sock_join_room(aed_lat,1);

                console.log("pat_addr",pat_addr);
                var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
                    credentials: "LaipUfshsMLolLAZr0sq~FDO1x20H4dyJ5APEQeI60w~Amnhlp-hS9x0bwRndSsIHyqE8Nfem8tHvnFl49T9FPSDpuECWnLynsspgCwAjNfm",
                });
                var directionsManager;
                Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
                  directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
                  directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.walking });
                  //var waypoint2 = new Microsoft.Maps.Directions.Waypoint({ address: '환자 위치', location: new Microsoft.Maps.Location( pat_lat,pat_lng )  });
                  var waypoint2 = new Microsoft.Maps.Directions.Waypoint({ address: '환자 위치', location: new Microsoft.Maps.Location( 35.890252,128.611339 )  });
                  var waypoint1 = new Microsoft.Maps.Directions.Waypoint({ address: '내 위치',  location: new Microsoft.Maps.Location( 35.88376396, 128.6116222 ) });
                  if(directionsManager.getAllWaypoints().length >0){
                    directionsManager.clearAll();

                  }
                  directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.walking });
                  directionsManager.addWaypoint(waypoint1);
                  directionsManager.addWaypoint(waypoint2);
                  // Set the element in which the itinerary will be rendered
                  directionsManager.calculateDirections();

                });
                /*
                if (navigator.geolocation){
                    navigator.geolocation.watchPosition(UsersLocationUpdated);
                }
                else{
                    alert("Geolocation is not supported by this browser.");
                }*/
                //routeMap2();

                function UsersLocationUpdated(position){
                  var myloc = new Microsoft.Maps.Location(
                      position.coords.latitude,
                      position.coords.longitude);
                      routeMap(myloc);
                }

                function routeMap ( mylocation ){

                        // Set Route Mode to walking

                        var waypoint1 = new Microsoft.Maps.Directions.Waypoint({ address: '내 위치', location: mylocation });
                        var waypoint2 = new Microsoft.Maps.Directions.Waypoint({ address: '환자 위치', location: new Microsoft.Maps.Location( pat_lat,pat_lng )  });

                        if(directionsManager.getAllWaypoints().length >0){
                          directionsManager.clearAll();

                        }
                        directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.walking });
                        directionsManager.addWaypoint(waypoint1);
                        directionsManager.addWaypoint(waypoint2);
                        // Set the element in which the itinerary will be rendered
                        directionsManager.calculateDirections();

                }

                function routeMap2 ( ){

                        // Set Route Mode to walking


                        var waypoint2 = new Microsoft.Maps.Directions.Waypoint({ address: '환자 위치', location: new Microsoft.Maps.Location( pat_lat,pat_lng )  });
                        var waypoint1 = new Microsoft.Maps.Directions.Waypoint({ address: '내 위치',  location: new Microsoft.Maps.Location( 35.88376396, 128.6116222 ) });
                        if(directionsManager.getAllWaypoints().length >0){
                          directionsManager.clearAll();

                        }
                        directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.walking });
                        directionsManager.addWaypoint(waypoint1);
                        directionsManager.addWaypoint(waypoint2);
                        // Set the element in which the itinerary will be rendered
                        directionsManager.calculateDirections();

                }

                function getCookie(name) {
                    name = name + "=";
                    var cookies = document.cookie.split(';');
                    for(var i = 0; i <cookies.length; i++) {
                      var cookie = cookies[i];
                      while (cookie.charAt(0)==' ') {
                        cookie = cookie.substring(1);
                      }
                      if (cookie.indexOf(name) == 0) {
                        return cookie.substring(name.length,cookie.length);
                      }
                    }
                    return "";
                  }

}

function sock_join_room (aedlat, aedlng){
    socket.emit('joinroom',{room: aedlat});

    socket.on('119addrupdate',function( data ){
      var msg = data.data.addAddr;
      console.log("119addupdate",data.data.addAddr);
      $addroutput2.empty();
      $addroutput2.append(msg);
    });

    socket.on('119addmsg',function( data ){
      var msg = data.data.addMsg;
      console.log("119addmsg",data);
      $mymsg.append('<BR>'+msg);
    });

};
