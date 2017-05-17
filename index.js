const Server = require('./lib/Server')

const app = new Server()
app.start(25565)