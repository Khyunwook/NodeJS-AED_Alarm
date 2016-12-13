var socket = require( 'socket.io' );

var numUsers =0;
var rooms = [];
var users = [];
var outusers =[];

var io;

var functions = {
  connect : function( server ){
    io = socket.listen( server);
    io.on('connection', function(socket){
      console.log('User connected');
        socket.on('disconnect', function(){
          console.log('user disconnected');
        });
      //방만들때
        socket.on('joinroom', function( data ){
            socket.join(data.room);
            console.log("joinroom data",data.room);
            socket.room = data.room;
            /*
            if( rooms[socket.room] == undefined ){
                rooms[socket.room] = new Object();
                rooms[socket.room].socket_ids = new Object();
            }
            */
            //addJoinuser


            //Store current user's nickname and socket.id to MAP
            //rooms[socket.room].socket_ids[userid] = socket.id;
        });


        //방에서 나갈때
        socket.on('exitroom', function(data) {
          //var room_id = data.room;
          //delete rooms[socket.room];
          console.log("exitroom",rooms);
        });


        //from 119 to walker
        socket.on('from119addr', function(data){
            console.log( "from119addr",data );
            io.in(socket.room).emit('119addrupdate',{ data : data});
            io.emit("fromServer2", { data : data.addAddr });
        });

        socket.on('from119msg', function(data){
            console.log( "from119msg",data );
            io.in(socket.room).emit('119addmsg',{ data : data});
            io.emit("fromServer3", { data : data.addMsg });
        });


    });
  },

  toAndroid : function (){
    console.log("toAndroid()");
    io.emit("fromServer1" ,{ data: "occur" });
    console.log("io",io);
 }


};

module.exports = functions;

