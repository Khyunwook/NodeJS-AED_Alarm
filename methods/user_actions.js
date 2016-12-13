var User = require('../models/user');
var jwt  = require('jwt-simple');
var config = require('../config/database');

var sess;

var functions = {

  loginRedirect : function (req, res){
    sess = req.session;
    console.log("test");
    if(sess.email){
      console.log("logining...",sess.email);
      res.redirect('main.html');
    }else{
      console.log("else");
      //console.log("req",req);
      console.log("__dirname",__dirname );
      res.redirect('login.html');
    }
  },
  //---------------logout 사용자 추가 함수 끝--------------------

  logout: function( req, res ) {
    req.session.destroy(function(err) {
        if(err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
      });
    },

  //---------------authenticate 사용자 인증 함수 시작--------------------
  authenticate: function(req, res){
    console.log('/auth/login 호출됨.');

    var paramId = req.body.userid;
    var paramPassword = req.body.password;

    var authUser = function( id, password, callback) {
      console.log('authUser 호출됨.');
      // 아이디와 비밀번호를 이용해 검색
      User.findOne( {userid :id }, function(err, user){
            if (err) {
              callback(err, null);
              return;
            }
            if(!user){
              console.log("일치하는 사용자를 찾지 못함.");
              callback(null, null);
            } else {
                user.comparePassword(password, function(err, isMatch){
                    if(isMatch && !err) {
                        var token = jwt.encode(user, config.secret);
                        console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', id, password);
                        callback(null, user);
                    } else {
                      console.log("비밀번호 틀림.");
                      callback(null, null);
                    }
                })
            }
        });
    }


    authUser( paramId, paramPassword, function(err, docs) {

      if (err) {throw err;}

      if (docs) {
        console.dir(docs);
        sess = req.session;
        sess.email = paramId;

        var username = docs.username;
        /*
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
        res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
        res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
        */
        console.log("autheUser login success");
        console.log("sess.email",sess.email);
        res.redirect("../main.html");
        res.end();

      } else {
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h1>로그인  실패</h1>');
          res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
          res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
          res.end();
      }
    });

  },
  //---------------authenticate 사용자 인증 함수 끝--------------------

  //---------------addNew 사용자 추가 함수 시작--------------------
  addNew: function(req, res){
    //console.log("addNew req",req);
      if((!req.body.userid) || (!req.body.password)){
          console.log(req.body.userid);
          console.log(req.body.password);

          res.json({success: false, msg: 'Enter all values'});
      }
      else {
          var userid = req.body.userid,
              username = req.body.username,
              password = req.body.password,
              email = req.body.email;

          var newUser = User({
              userid: userid,
              username: username,
              password: password,
              email: email

          });

          //사용자를 등록하는 함수
          var addUser = function(userid, username, password, email, callback) {
            console.log('addUser 호출됨.');

            newUser.save(function(err, newUser){
              if (err){
                  console.log('newUser err',err);
                  callback(err, null);
                  return;
              }

              else {
                  console.log('newUser success',newUser);
                  console.log("사용자 데이터 추가함.");
                  callback(null, newUser);
              }
            });
          }

          addUser( userid, username, password, email, function(err, result) {
            if (err) {throw err;}

            if (result) {
              console.dir(result);

              res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
              res.write('<h2>사용자 추가 성공</h2>');
              res.end();
            } else {
              res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
              res.write('<h2>사용자 추가  실패</h2>');
              res.end();
            }
          });

      }
  }
  //---------------addNew 사용자 추가 함수 끝--------------------


};

module.exports = functions;
