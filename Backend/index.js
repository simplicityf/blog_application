const app = require("./app")
const http = require("http")
const {port} = require("./config/keys")

const server = http.createServer(app)

server.listen(port, () => 
    console.log("http://localhost:4000")
)