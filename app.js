const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

let counters = [];

let rooms = []

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
  })
  socket.on("newCounter", function (payload) {
    counters[0].counter = payload.score
    
    socket.broadcast.emit("scoreLawan", payload.score);
  });


});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
