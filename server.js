const http = require("http")
const fs = require("fs")
const path = require("path")

const port = 3000

const types = {
".html": "text/html",
".css": "text/css",
".js": "application/javascript",
".png": "image/png",
".jpg": "image/jpeg",
".svg": "image/svg+xml"
}

http.createServer((req, res) => {
let file = req.url === "/" ? "/index.html" : req.url
let filePath = path.join(__dirname, file)
let ext = path.extname(filePath)

fs.readFile(filePath, (err, content) => {
if (err) {
res.writeHead(404)
res.end("404")
return
}

res.writeHead(200, { "Content-Type": types[ext] || "text/plain" })
res.end(content)
})
}).listen(port, () => {
console.log(`Flappy Ball rodando em http://localhost:${port}`)
})
