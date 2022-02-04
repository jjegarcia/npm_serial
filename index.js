/* eslint-disable node/no-missing-require */

// Initialize application constants
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const tcpPort = process.env.PORT || 3000
const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline

const port = new SerialPort('/dev/tty.usbmodem02691', {
    baudRate: 9600,
})
const parser = new Readline()
port.pipe(parser)

/* ===========================================
*
* Setup a simple server.
*
=========================================== */

app.get('/', (req, res) => {
    res.sendfile('index.html')
})

http.listen(tcpPort, () => {
    console.log(`listening on http://localhost:${tcpPort}`)
})

/* ===========================================
*
*  Socket.io stuff
*
=========================================== */
io.on('connection', socket => {
    console.log('a user connected')
    socket.on('message', msg => {
        console.log('UI received: ', msg)
        switch (msg) {
            case 'on':
                port.write('HIGH\n')
                break
            case 'off':
                port.write('LOW\n')
                break
            default:
                break
        }
    })
})
/* ===========================================
*
* Serialport stuff
*
=========================================== */

port.on('open', () => {
    console.log('Port is open!')
})

parser.on('data', data => {
    console.log('==>' + data)
    io.sockets.emit('new message', data)
})

port.on('close', () => {
    console.log('Serial port disconnected.')
    io.sockets.emit('close')
})
