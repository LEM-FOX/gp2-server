const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

let counter = [{
    name: "player1",
    counter: 0
}]

io.on("connect", (socket) => {
    socket.emit("countClick", counter);
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
