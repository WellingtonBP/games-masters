import axios from 'axios'
import { randomBytes } from 'crypto'

const baseUrl = 'http://localhost:3000'
const userHash = randomBytes(20).toString('hex')
const appid = 12100
const axiosCfg = {
  headers: { 'user-hash': userHash },
  validateStatus: (status: number) => true
}

describe('Testing API Routes', () => {
  describe('Root routes', () => {
    test('[GET] / Should return an array with 300 games object', async () => {
      const { data, status } = await axios.get(`${baseUrl}/`)
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBe(300)
      expect(data[0]).toHaveProperty('appid')
      expect(data[0]).toHaveProperty('name')
      expect(status).toBe(200)
    })

    test('[GET] /?limit=10 Should return an array with 10 games object', async () => {
      const { data, status } = await axios.get(`${baseUrl}/?limit=10`)
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBe(10)
      expect(status).toBe(200)
    })

    test("[GET] /:id (invalid id) Should return 404 status with 'game not found' message", async () => {
      const { data, status } = await axios.get(`${baseUrl}/not-found`, axiosCfg)
      expect(data).toHaveProperty('error', 'game not found')
      expect(status).toBe(404)
    })

    test('[GET] /:id Should return an object with game details', async () => {
      const { data, status } = await axios.get(`${baseUrl}/${appid}`)
      expect(data).toHaveProperty('type', 'game')
      expect(data).toHaveProperty('detailed_description')
      expect(status).toBe(200)
    })

    test('[GET] /:id?fields=name Should return an object with name of game', async () => {
      const { data, status } = await axios.get(
        `${baseUrl}/${appid}?fields=name`
      )
      // testing with id of gta III
      expect(data).toEqual({ name: 'Grand Theft Auto III' })
      expect(status).toBe(200)
    })
  })

  describe('Favorite routes', () => {
    test('[POST] /favorite (without user-hash) Should return 403 status with error message', async () => {
      const { data, status } = await axios.post(`${baseUrl}/favorite`, null, {
        validateStatus: status => true
      })
      expect(data).toEqual({ error: 'user-hash header not found' })
      expect(status).toBe(403)
    })

    test('[POST] /favorite (with user-hash) Should return 422 status with error message for invalid rating', async () => {
      const { data, status } = await axios.post(
        `${baseUrl}/favorite`,
        { appid, rating: 7 },
        axiosCfg
      )
      expect(data).toEqual({ error: 'Invalid rating, must be between 0 and 5' })
      expect(status).toBe(422)
    })

    test('[GET] /favorite (with user-hash and before post) Should return an empty array', async () => {
      const { data, status } = await axios.get(`${baseUrl}/favorite`, axiosCfg)
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBe(0)
      expect(status).toBe(200)
    })

    test('[DELETE] /favorite/:id (with user-hash and before post) Should return 204 status with no message', async () => {
      const { data, status } = await axios.delete(
        `${baseUrl}/favorite/${appid}`,
        axiosCfg
      )
      expect(data).toBe('')
      expect(status).toBe(204)
    })

    test('[POST] /favorite (with user-hash) Should return 200 status for valid request', async () => {
      const { data, status } = await axios.post(
        `${baseUrl}/favorite`,
        { appid, rating: 5 },
        axiosCfg
      )
      expect(status).toBe(200)
    })

    test('[GET] /favorite (with user-hash and after post) Should return an array with favorite games', async () => {
      const { data, status } = await axios.get(`${baseUrl}/favorite`, axiosCfg)
      expect(Array.isArray(data)).toBe(true)
      expect(data[0]).toHaveProperty('appid', appid)
      expect(status).toBe(200)
    })

    test('[DELETE] /favorite/:id (with user-hash and after post) Should return 200 status with success message', async () => {
      const { data, status } = await axios.delete(
        `${baseUrl}/favorite/${appid}`,
        axiosCfg
      )
      expect(data).toEqual({ message: 'success' })
      expect(status).toBe(200)
    })
  })
})
