

var express=require('express')
    , http=require('http')
    , path=require('path')
    , bodyParser=require('body-parser')
    , cookieParser=require('cookie-parser')
    , expressSession=require('express-session')
    , expressErrorHandler=require('express-error-handler')
    , routes = require('./routes/routes')
    , config = require('./config/database')
    , socket_actions = require('./methods/socket_actions');

var mongodb=require('mongodb');
var mongoose = require('mongoose');
/* NodeJs 샘플 코드 */

var app=express(),
    server = http.Server(app);

//db연결
mongoose.connect(config.database);
var database = mongoose.connection;

database.on('error', console.error.bind(console, 'mongoose connection error.'));
database.on('open', function () {
	console.log('데이터베이스에 연결되었습니다.');
});


//서버 변수 설정 및 static으로 public 폴더 설정
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
//app.use(cors);
app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));
app.use(routes.router);

socket_actions.connect( server );


//===== 서버 시작 =====//
server.listen(app.get('port'), function(){
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

});
