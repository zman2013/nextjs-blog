import * as net from 'net'
import { startProxy } from './remote-proxy'

const port = Number(process.env.proxy_port)
const host = process.env.proxy_host

let alreadyRes = false
export default function handler(req, res) {
    startProxy(host, port, message=>{
      if(!alreadyRes){
        console.log({message})
        res.status(200).json({port, host, message})
        alreadyRes = true
      }
    })
    
}


/**
length
{
  cmd: CONNECT,
  host,
  port
 }

 
 */

