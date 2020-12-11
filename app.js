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
    // console.log(rooms, 'ini dari room')
    io.emit('updatedRoom', rooms)
  })
  socket.on('joinRoom', payload => {
    collectionPlayer.push(payload.username)
    // console.log(collectionPlayer, "-0-0-0-0-0-0-0-0")
    socket.join(payload.roomName, () => {
      let roomIndex = rooms.findIndex((i) => i.name == payload.roomName)
      rooms[roomIndex].users.push(payload.username)
      io.sockets.in(payload.roomName).emit("roomDetail", rooms[roomIndex])
    })
    
  })
  socket.on('startGame', data => {
    
    socket.broadcast.to(data).emit('startGame')
    // console.log(rooms, counters, "---------------------------")
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
