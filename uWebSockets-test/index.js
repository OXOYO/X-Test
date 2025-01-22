const uWS = require('uWebSockets.js');

// 创建 uWebSockets.js 应用
const app = uWS.App();

// 处理 HTTP GET 请求
app.get('/hello', (res, req) => {
  const time = new Date().toLocaleString()
  res.writeStatus('200 OK').end(`Hello from uWebSockets.js! ${time}`);
});

// 处理 WebSocket 连接
app.ws('/*', {
  open: (ws) => {
    console.log('A WebSocket connection is opened!');
    const handler = () => {
      const time = new Date().toLocaleString()
      console.log('send MSG', time)
      ws.send(`Hello from server::${time}`);
    }
    setInterval(handler, 5000)
    handler()
  },
  message: (ws, message) => {
    console.log('Received message:', Buffer.from(message).toString());
    ws.send('You said: ' + Buffer.from(message).toString());
  },
  close: (ws) => {
    console.log('A WebSocket connection is closed!');
  },
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, (token) => {
  if (token) {
    console.log(`Server is running on http://localhost:${PORT}`);
  } else {
    console.log('Failed to start server!');
  }
});
