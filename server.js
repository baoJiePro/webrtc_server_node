const express = require('express');
const app = express();
const http_server = require('http').createServer(app);
const https = require('https')
const fs = require('fs')
const path = require("path");
const port = process.env.PORT || 7000;
const hostname = "0.0.0.0";
const https_port = 7001

app.use(express.static(path.join(__dirname, 'public')), null);


http_server.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});

const options = {
    key: fs.readFileSync('./cert/8365327_www.baortc.cn.key'),
    cert: fs.readFileSync('./cert/8365327_www.baortc.cn.pem')
}

const https_server = https.createServer(options, app)
const SkyRTC = require('./public/dist/js/SkyRTC.js').listen(http_server);
// const SkyRTC = require('./public/dist/js/SkyRTC.js').listen(https_server);
https_server.listen(https_port, hostname, function(){
    console.log(`Server running at https://${hostname}:${port}/`);
})

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

SkyRTC.rtc.on('new_connect', function (socket) {
    console.log('创建新连接');
});

SkyRTC.rtc.on('remove_peer', function (socketId) {
    console.log(socketId + "用户离开");
});

SkyRTC.rtc.on('new_peer', function (socket, room) {
    console.log("新用户" + socket.id + "加入房间" + room);
});

SkyRTC.rtc.on('socket_message', function (socket, msg) {
    console.log("接收到来自" + socket.id + "的新消息：" + msg);
});

SkyRTC.rtc.on('ice_candidate', function (socket, ice_candidate) {
    console.log("接收到来自" + socket.id + "的ICE Candidate");
});

SkyRTC.rtc.on('offer', function (socket, offer) {
    console.log("接收到来自" + socket.id + "的Offer");
});

SkyRTC.rtc.on('answer', function (socket, answer) {
    console.log("接收到来自" + socket.id + "的Answer");
});

SkyRTC.rtc.on('error', function (error) {
    console.log("发生错误：" + error.message);
});