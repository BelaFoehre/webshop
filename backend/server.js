const http = require('http');
const app = require('./app');
const server = http.createServer(app);

app.set('port', process.env.PORT);


// server listening 
// server.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });

const onListening = () => {
  server.address(process.env.HOST);
  const addr = server.address();
  console.log(addr)
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + process.env.PORT;
  // debug("++ Listening on " + bind);
  console.log(`Server running on ${bind}`);
};

server.on("listening", onListening);
server.listen(process.env.PORT);