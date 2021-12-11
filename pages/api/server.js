import * as net from 'net'

export default function handler(req, res) {
  net.createServer((socket)=>{
    console.log('new socket')
  }).listen(8080)
  res.status(200).json({ name: 'John Doe' })
}


