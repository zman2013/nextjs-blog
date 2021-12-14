
import {Buffer} from 'buffer'
import {scryptSync, createCipheriv, createDecipheriv} from 'crypto'
import { Transform } from 'stream'

const algorithm = 'aes-192-cbc'
const password = 'mvSCv76Y'
const key = scryptSync(password, 'salt', 24)
const iv = Buffer.alloc(16, 0)

// export function getCipher(){
//   return createCipheriv(algorithm, key, iv)
// }
// export function getDecipher(){
//   return createDecipheriv(algorithm, key, iv)
// }

export function getCipher(){
  const transform = new Transform({
    transform(chunk, encoding, callback) {
      const cipher = createCipheriv(algorithm, key, iv)
      // console.log('cipher in', chunk.toString())
      let encrypted = cipher.update(chunk)
      encrypted = Buffer.concat([encrypted, cipher.final()])
      // let encrypted = cipher.update(chunk.toString(), 'utf8', 'hex')
      // encrypted += cipher.final('hex')
      // console.log('cipher out', encrypted)

      callback(null, encrypted);

    }
  })

  return transform

}
export function getDecipher(){
  const transform = new Transform({
    transform(chunk, encoding, callback) {
      // console.log('decipher in', chunk.toString())
      const decipher = createDecipheriv(algorithm, key, iv)
      let msg = decipher.update(chunk)
      msg = Buffer.concat([msg, decipher.final()])

      // let msg = decipher.update(chunk.toString(), 'hex', 'utf8')
      // msg += decipher.final('utf8')

      // console.log('decipher out', msg)

      callback(null, msg);
    }
  })

  return transform
}

