const Koa = require('koa');
const http = require('http');
const { Server } = require('socket.io');
const moment = require('moment');
const { log } = require('console');

const app = new Koa();

const chatList = [];
const server = http.createServer(app.callback());
const io = new Server(server, {
  serveClient: false,
  cors: {
    origin: '*', // from the screenshot you provided
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.emit('message', chatList);
  socket.on('send-message', (user, message) => {
    const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
    chatList.push({
      user,
      message,
      createTime,
    });
    socket.emit('message', chatList);
  });
});
io.listen(3001);