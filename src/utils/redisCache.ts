import { redisClient as client } from '../app'

function setCache(key: string, value: any): Promise<'OK' | undefined> {
  return new Promise((resolve, reject) => {
    client.set(key, value, 'EX', 60 * 60 * 24, (err, res) => {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

function getCache(key: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    client.get(key, (err, res) => {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

export { setCache, getCache }
