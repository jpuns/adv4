const port = process.env.PORT; //|| 10000;
const server = require("http").Server();

var io = require("socket.io") (server);
var allqs = {};
var names = [];
var allusers = {};

io.on("connection", function(socket){
    
    socket.on("joinroom", function(data){
        console.log("joining room", data);
        
        socket.join(data);
        socket.myRoom = data;
        socket.emit("yourid", socket.id);
        
        if(!allusers[data]){
            allusers[data] = [];
        }
        
        allusers[data].push(socket.id);
        io.to(data).emit("userjoined", allusers[data]);
        if(!allqs[data]){
            allqs[data] = {};
                qobj:{}
        }
        
    });
    
    socket.on("uname", function(data){
        console.log("username sent = "+data);
        names.push(data);
        
        io.emit("names", names);
        
    });
    
    socket.on("answer", function(data){
        var msg = "Incorrect";
        
        if(data == allqs[socket.myRoom].qobj.a){
            
            msg = "Correct";
        }
        io.emit("result", msg);
        
  
    })
    
    socket.on("qsubmit", function(data){
        allqs[socket.myRoom].qobj = data;
        socket.to(socket.myRoom).emit("newq", data);
        
    });
    
    socket.on("disconnect", function(){
        /*var index= allusers.indexOf(socket.id);
        allusers.splice(index, 1);
        io.emit("userjoined", allusers);*/
        if(this.myRoom){
            var index = allusers[this.myRoom].indexOf(socket.id);
            allusers[this.myRoom].splice(index, 1);
            io.to(this.myRoom).emit("userjoined", allusers[this.myRoom]);
        }
    

    })
});

server.listen(port,(err)=>{
    if(err){
        console.log(err);
        return false;
    }
    
    console.log("Port is running");
})









