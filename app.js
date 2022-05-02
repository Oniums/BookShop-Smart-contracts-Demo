var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var fs = require('fs');
var app = express();
var Web3 = require("web3");
var contract = require("truffle-contract");
app.engine('html', ejs.__express);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
var account = "0xEEA0CadfD66944Cdcb054B3C72328D27C277328d";
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//区块链连接
var data = fs.readFileSync(path.join(__dirname, '/public/build/contracts/Transaction.json'));
var provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
var contracts = contract(JSON.parse(data));
contracts.setProvider(provider);

var history=[];

app.post('/insert', function (req, res) {
  res.send("OK");
  console.log("光照强度:"+req.body.light);
  insert(req.body.light)
})


function insert(value) {
  var Instance;
  contracts.deployed().then(function (contractInstance) {
    Instance = contractInstance;
    return Instance.insertdata(Date.parse(new Date())/1000, value, { from: account });
  }).then(function (result) {
    // console.log(result)
  }).catch(function (err) {
    console.log(err.message);
  });
}
// gethistroydata();
// function gethistroydata() {
//   var Instance;
//   contracts.deployed().then(function (contractInstance) {
//     Instance = contractInstance;
//     return Instance.getCount.call();
//   }).then(function (datasCount) {
//     if(datasCount.words[0]!=0){
//       for (var i = 1; i <= datasCount.words[0];i++) {
//         getvalue(i);
//         gettime(i);
//     }}  
//   }).catch(function (err) {
//     console.log(err.message);
//   });
// }
// function getvalue(index){
//     var Instance;
//     contracts.deployed().then(function (contractInstance) {
//     Instance = contractInstance;
//     return Instance.getValue.call(index);
//   }).then(function (result) {
//     console.log(result.words[0])
//   }).catch(function (err) {
//     console.log(err.message);
//   });
// }
// function gettime(index){
//   var Instance;
//   contracts.deployed().then(function (contractInstance) {
//   Instance = contractInstance;
//   return Instance.getTime.call(index);
// }).then(function (result) {
//   console.log(result.words[0])
//   console.log("time"+Date.parse(new Date())/1000)
// }).catch(function (err) {
//   console.log(err.message);
// });
// }


// gethistroydata();
// insert(300);
// insert(500);
// insert(700);
// app.get('/send', function (req, res) {
//   res.send("OK");
//   fs.readFile(path.join(__dirname, 'public/books.json'), "utf8", function (err, data) {
//     data = data.substring(0, data.length - 1) + `,{"id": ` + parseInt(req.body.id) + `,"bookname": "` + req.body.bookname + `","picture": "` + req.body.picture + `","value": ` + parseInt(req.body.bookvalue) + `}]`;
//     fs.writeFile(path.join(__dirname, 'public/books.json'), data, function (err) { if (err) throw err; });
//   })
// })


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
