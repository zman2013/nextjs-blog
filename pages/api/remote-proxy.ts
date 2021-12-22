
import * as net from 'net'
import * as lpstream from 'length-prefixed-stream'
import { Duplex } from 'stream'
import { getCipher, getDecipher } from './proxy-cipher'
import { connect } from './connector'

process.on('uncaughtException', e=>{
  console.log(e)
})
process.on('unhandledRejection', e=>{
  console.error(e)
})

const proxyHost = 'xiu66.site'
const proxyPort = 11025

const socketNoMapping = new Map<string, Duplex>()
let no: string|undefined
let cmd: string|undefined


export function startProxy(cb: (message)=>void){
  connect(proxyHost, proxyPort, (socket)=>{
    cb(`connected to ${proxyHost}:${proxyPort}`)
    const encode = lpstream.encode() as any
    const decode = lpstream.decode() as any
    // const cipher = getCipher()
    // const decipher = getDecipher()
    // communicateWithProxy(cipher, decipher)
    // cipher.pipe(encode).pipe(socket)
    // socket.pipe(decode).pipe(decipher)

    communicateWithProxy(encode, decode)
    encode.pipe(socket)
    socket.pipe(decode)
  })
}

function communicateWithProxy(cipher:Duplex, decipher: Duplex){
  decipher.on('data', (chunk)=>{
    console.log('proxy -> remote-proxy, chunk', chunk.length)
    if(!no){
      // {no, cmd}
      const json = JSON.parse(chunk.toString())
      no = json.no
      cmd = json.cmd
    }else{
      
      if(cmd === 'CONNECT'){
        const socketNo = no
        // {host, port}
        const json = JSON.parse(chunk.toString())
        const socket = net.connect(json.port, json.host, ()=>{
          console.log('connected to ', {host: json.host, port: json.port, socketNo})
          socketNoMapping.set(socketNo, socket)
          cipher.write(socketNo)
          cipher.write('HTTP/1.1 200 Connection Established\r\n\r\n')
        }).on('data', (chunk)=>{
          console.log('data -> ', socketNo)
          cipher.write(socketNo)
          cipher.write(chunk)
        }).on('close', ()=>{
          console.log('socket closed', {socketNo})
          socketNoMapping.delete(socketNo)
        })
      }else if( cmd === 'DATA'){
        console.log('received from proxy', {no})
        const result = socketNoMapping.get(no).write(chunk)
        console.log('write', {result})
      }
      no = undefined
      cmd = undefined
    }
  })  
}

