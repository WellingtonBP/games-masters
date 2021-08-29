import axios from 'axios'

import { setCache, getCache } from './redisCache'
import { GameDetailsData, CustomError, GameDetailsResponse } from '../types'

function gameNotFound(): never {
  const error: CustomError = new Error()
  error.status = 404
  error.customMessage = 'game not found'
  throw error
}

async function fetchGameDetails(id: number): Promise<GameDetailsData | never> {
  if (!Number(id)) gameNotFound()

  let game: string | GameDetailsData | null = await getCache(String(id))

  if (!game) {
    const responseData = (
      await axios.get<GameDetailsResponse | null>(
        `https://store.steampowered.com/api/appdetails?appids=${id}`
      )
    ).data

    if (!responseData?.[id].success || !responseData) gameNotFound()

    game = {
      ...responseData[id].data,
      appid: responseData[id].data.steam_appid
    }
    await setCache(String(id), JSON.stringify(game))
  } else game = JSON.parse(game)

  return game as GameDetailsData
}

export default fetchGameDetails
