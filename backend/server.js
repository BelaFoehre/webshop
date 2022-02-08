const http = require('http');
const { debug } = require('console');
const app = require('./app');
const mongoose = require('mongoose');

app.set('port', process.env.PORT);

const MONGO_URL = 'mongodb+srv://'
                    + process.env.DB_USER
                    + ':' + process.env.DB_PW
                    + '@cluster0.0q23p.mongodb.net/'
                    + process.env.DB_NAME
                    + '?retryWrites=true&w=majority';

const MONGO_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(MONGO_URL, MONGO_OPTIONS);

mongoose.connection
    .once('open', () => console.log('++ Connection to DB established'))
    .on('error', (error) => console.warn('-- Connection failed: ', error));

const onListening = () => {
  server.address(process.env.HOST);
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + process.env.PORT;
  debug("++ Listening on " + bind);
};

const server = http.createServer(app);
server.on("listening", onListening);
server.listen(process.env.PORT);