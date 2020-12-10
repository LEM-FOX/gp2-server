const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

let counters = [
  {
    name: "player1",
    counter: 0,
  },
];

io.on("connect", (socket) => {
  // io.in("Game").emit("countClick", counters)
  io.emit("countClick", counters);
  // io.emit("countClick", counters);

  socket.on("newCounter", function (payload) {
    // counters[0].counter = payload.score
    counters.push(payload.score);
    // console.log(counters.length - 1);
    socket.broadcast.emit("scoreLawan", payload.score);
  });

  socket.on("terserahlulah", function (payload) {
    counters[0].name = payload;
    socket.emit("username", payload);
    // console.log(counters[0].name);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
