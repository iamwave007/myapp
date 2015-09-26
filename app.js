var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



var RCSDK = require('rcsdk');
var rcsdk = new RCSDK({
    server: 'https://platform.devtest.ringcentral.com', // SANDBOX
    //server: 'https://platform.ringcentral.com', // PRODUCTION
    appKey: 'TBKptrYpTrWyIqt8_HSNyQ',
    appSecret: 'x5--y3zWQ1eTnIgXqXCm5wJi5UYznoQ4aH_oWtnMzocg'
});

var platform = rcsdk.getPlatform();

platform.authorize({
    username: '+18024486664', // phone number in full format
    extension: '', // leave blank if direct number is used
    password: 'D_qx@126.com'
}).then(function(response) {
      console.log('Here');

      // return platform.get('/account/~/extension/~');

        // platform.post('/account/~/extension/~/sms', {
        //     body: {
        //         from: {phoneNumber:"+18024486664"}, // Your sms-enabled phone number
        //         to: [
        //             {phoneNumber:"+17654099422"} // Second party's phone number
        //         ],
        //         text: 'Yojojoojojoj'
        //     }
        // }).then(function(response) {
        //     console.log('SMS Success: ' + response.data.id);
        // }).catch(function(e) {
        //     console.log('SMS Error: ' + e.message);
        // });
        function ringOutHelper(rcsdk) {
            var t=this;
            t.rcsdk = rcsdk;
            t.init = function() {
                t.platform = t.rcsdk.getPlatform();
                t.Ringout = t.rcsdk.getRingoutHelper(); // this is the helper
                t.Utils = rcsdk.getUtils();
                t.Log = rcsdk.getLog();
                t.timeout = null; // reference to timeout object
                t.ringout = {};
            }
            t.handleError = function(e) {
                t.Log.error(e);
                console.log(e.message);
            }
            t.create = function(unsavedRingout) {
                console.log("CREATE " + JSON.stringify(unsavedRingout));
                t.platform
                    .apiCall(t.Ringout.saveRequest(unsavedRingout))
                    .then(function(response) {

                        t.Utils.extend(t.ringout, response.data);
                        t.Log.info('First status:', t.ringout.status.callStatus);
                        //t.timeout = t.Utils.poll(update, 500, t.timeout);

                    })
                    .catch(t.handleError);
            }
            t.init();
        }

        var ringOutHelper = new ringOutHelper(rcsdk);
        ringOutHelper.create({
            from: {phoneNumber: "+16505626570"},
            to: {phoneNumber: "+17654099422"},
            //callerId: {phoneNumber: '18882222222'}, // optional,
            playPrompt: false // optional
        });

}).catch(function(e) {
    console.log(e.message  || 'Server cannot authorize user');
});
// .then(function(res){

// // console.log(res.json);

// })








module.exports = app;
