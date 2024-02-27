// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIo(server);

// Хранение состояния окон для игроков
let windowsState = Array(10).fill(false); // false - окно свободно, true - окно занято

io.on('connection', (socket) => {
  console.log('Client connected');

  // Отправка состояния окон при подключении нового клиента
  socket.emit('initialWindowsState', windowsState);

  // Обработка события занятия окна
  socket.on('occupyWindow', (windowId) => {
    windowsState[windowId] = true;
    io.emit('updateWindowsState', windowsState);
  });

  // Обработка события освобождения окна
  socket.on('releaseWindow', (windowId) => {
    windowsState[windowId] = false;
    io.emit('updateWindowsState', windowsState);
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});
