import * as net from 'net'
import { startProxy } from './remote-proxy'

const port = Number(process.env.proxy_port!)
const host = process.env.proxy_host!

export default function handler(req, res) {
    startProxy(message=>{
      res.status(200).json({port, host, message})
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

