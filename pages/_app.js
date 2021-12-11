import '../styles/global.css'

import * as net from 'net'

net.createServer((socket)=>{
  console.log('new socket')
}).listen(8080)

export default function App({Component, pageProps}){
  return <Component {...pageProps} />
}