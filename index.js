const express = require('express');
const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets; 
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

const uri = "mongodb+srv://admin:Admin1234@francesco-i5qce.mongodb.net/test?retryWrites=true&w=majority";

mongo.connect(uri, function(err, db){
  if (err){ throw err};
  console.log('connesso')
  client.on('connection', function(socket) {
    let chat = db.collection('chats');
    //send status
    sendStatus = function(s){
      //dal server al client .emit
      socket.emit('status', s);
    }

    //get chats
    chat.find().limit(50).sort({_id:1}).toArray(function(errr, result){
      if (errr){
        throw errr;
      }
      socket.emit('output',res);
    });

    //input events
    socket.on('input', function(data){
      let name = data.name;
      let message = data.message;

      //check fro name and message
      if(name == '' || message == ''){
        //mess e name vuoto
        sendStatus('please enter a name and message');
      } else{
        //insert
        chat.insert({name:name,message: message}, function(){
          client.emit('output', [data]);

          //send status object
          sendStatus({
            message: 'Message Sent',
            clear: true
          })
        })

      }
    })

    //clear
    socket.on('clear', function(data){
      //remove all from db
      chat.remove({}, function(){
        socket.emit('cleared');
      })
    })
  });

})
