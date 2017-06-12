//  OpenShift sample Node application
var express = require('express'),
    fs      = require('fs'),
    path = require('path'),
    app     = express(),
    mongoose = require('mongoose'),
    ejs     = require('ejs'),
    morgan  = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    http = require('http');


//add external files
var index = require('./routes/index');
var user = require('./routes/user');
var message = require('./routes/message');
var conversation = require('./routes/conversation');
//var login = require('./routes/login');
//add modeles files
var Conversation = require('./models/Conversation.js');
var User = require('./models/User.js');
var Message = require('./models/Message.js');
    
//Object.assign=require('object-assign')


//make folder 'public' public
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Allow parsing cookies from request headers
app.use(cookieParser());
// Session management
app.use(session({
    // Private crypting key
    "secret": "some private",
    "store":  new session.MemoryStore({ reapInterval: 60000 * 10 })
}));
///app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

// Use native Node promises
mongoose.Promise = global.Promise;
// connect to MongoDB
mongoose.connect('mongodb://localhost/skypeuqac')
.then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

//add routes
app.use('/', index);
app.use('/login', index);
app.use('/user', user);
app.use('/message', message);
app.use('/conversation', conversation);

app.get('/pagecount', function (req, res) {
        res.send('{ pageCount: -2 }');
});

//websocket part
var server = app.listen(8080);
var io = require('socket.io')(server);
var clientMap = new Map();
io.on('connection', function(socket,pseudo){
    console.log('a user connected');
      socket.on('new user', function(client){
                socket.pseudo = client.pseudo;
                socket.idUser = client.idUser;
                console.log('connection de : ' + client.pseudo +' '+ client.idUser);
                clientMap.set(client.idUser,socket.id);
                console.log(clientMap.get(pseudo));
                });
      socket.on('message', function(msg){
            msg.conversation.participants.forEach(function(element){
                if(socket.idUser!=element){
                    socket.to(clientMap.get(element)).emit('message', msg.message);
                }
            });
        });
      
      socket.on('messageIphone', function(msg){
                Conversation.findById(msg.conversation, function (err, post){
                    if (err) return next(err);
                    post.participants.forEach(function(element){
                        if(socket.idUser!=element.id){
                            console.log("testmessageiphone2")
                            console.log(element)
                            socket.to(clientMap.get(element.id)).emit('message', msg.message);
                        }
                    });                }).populate({path:'participants'}).populate({path:'data',populate:{path:'writer',select:'pseudo'}});
                });
      socket.on('friend', function(msg){
                socket.to(clientMap.get(msg.friend)).emit('friend');
      });
      socket.on('conversation', function(msg){
                socket.to(clientMap.get(msg.friend)).emit('conversation');
      });
      
      socket.on('disconnect', function () {
                console.log('a user disconnected');
                });
});

/*catch 404 and forward to error handler
app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        });

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});*/



//app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
