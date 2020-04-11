const connect = require('connect')
const serveStatic = require('serve-static')
const http = require('http')
const path = require('path')
const app = connect()

const port = 3000
app.use(serveStatic(path.join(__dirname, '../public'), {'index': ['index.html']}))
http.createServer(app).listen(port, () => console.log(`App is running on port ${port}`))
