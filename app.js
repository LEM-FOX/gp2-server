const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

let counters = [];

let rooms = []

let collectionPlayer = []

io.on("connect", (socket) => {
  // io.in("Game").emit("countClick", counters)
  io.emit("countClick", counters);
  // io.emit("countClick", counters);
  socket.on("playerRegistration", function (payload) {
    counters.push(payload)
    socket.emit("playerData", counters);
  });
  socket.on('createRoom', payload => {
    let room = {
      name: payload.roomName,
      users: [],
      admin : payload.admin
    }
    rooms.push(room)
    io.emit('updatedRoom', rooms)
  })

  socket.on('joinRoom', payload => {
    collectionPlayer.push(payload.username)
    socket.join(payload.roomName, () => {
      let roomIndex = rooms.findIndex((i) => i.name == payload.roomName)
      rooms[roomIndex].users.push(payload.username)
      io.sockets.in(payload.roomName).emit("roomDetail", rooms[roomIndex])
    })
  })
  socket.on('startGame', data => {
    io.in(data).emit('startGame')
    // socket.broadcast.to(data).emit('startGame')
    io.emit('collectionPlayer', collectionPlayer)
  })
  socket.on("newCounter", function (payload) {
    if(payload.score == 10){
      io.sockets.in(payload.roomName).emit('gameOver', `${payload.players[0]} win`)
    } else if(payload.scoreLawan == 10) {
      io.sockets.in(payload.roomName).emit('gameOver', 'you lose')
    } else {
      socket.broadcast.emit("scoreLawan", payload.score);
    }
    // console.log(payload)
  });
  
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
=======
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

let counters = [];

let rooms = []

let collectionPlayer = []

io.on("connect", (socket) => {
  // io.in("Game").emit("countClick", counters)
  io.emit("countClick", counters);
  // io.emit("countClick", counters);
  socket.on("playerRegistration", function (payload) {
    counters.push(payload)
    socket.emit("playerData", counters);
  });
  socket.on('createRoom', payload => {
    let room = {
      name: payload.roomName,
      users: [],
      admin : payload.admin
    }
    rooms.push(room)
    io.emit('updatedRoom', rooms)
  })
  socket.on('joinRoom', payload => {
    collectionPlayer.push(payload.username)
    // console.log(collectionPlayer, "-0-0-0-0-0-0-0-0")
    socket.join(payload.roomName, () => {
      let roomIndex = rooms.findIndex((i) => i.name == payload.roomName)
      rooms[roomIndex].users.push(payload.username)
      console.log(rooms[roomIndex], 'ini dari socket join room')
      io.sockets.in(payload.roomName).emit("roomDetail", rooms[roomIndex])
    })
    
  })
  socket.on('startGame', data => {
    console.log(data, 'tes')
    io.in(data).emit('startGame')
    socket.broadcast.to(data).emit('startGame')
  })
  socket.on("newCounter", function (payload) {
    counters[0].counter = payload.score
    
    socket.broadcast.emit("scoreLawan", payload.score);
  });
  
  io.emit("collectionPlayer", collectionPlayer)
  
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
