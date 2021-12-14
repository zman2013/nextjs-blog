import * as net from 'net'
import { startProxy } from './remote-proxy'

const port = 8588
const host = 'localhost'

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

