import * as net from 'net'
import inject from 'reconnect-core'
import * as stream from 'stream'

export function connect(host: string, port: number, cb: (connect: stream.Duplex)=>void){
  const reconnect = inject(function(){
    return net.connect.apply(null, arguments)
  })
  const re = reconnect({
    initialDelay: 1e3,
    maxDelay: 30e3
  }).on('connection', (connect: any)=>{
    console.log('connected to', {host, port})
    cb(connect)
  }).on('error', error=>{
    console.error('socket to proxy error', error)
  }).connect({port, host})


}



