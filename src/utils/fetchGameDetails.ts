import axios from 'axios'

import GameDetails from '../models/GameDetails'
import { GameDetailsDoc } from '../types'

async function fetchGameDetails(id: number): Promise<GameDetailsDoc | null> {
  let game = await GameDetails.findOne(
    { steam_appid: Number(id) },
    { _id: 0, __v: 0 }
  )

  if (!game) {
    const responseData = (
      await axios.get(
        `https://store.steampowered.com/api/appdetails?appids=${id}`
      )
    ).data
    if (!responseData[id].success || !responseData) {
      return null
    }
    game = new GameDetails(responseData[id].data)
    game.appid = game.steam_appid
    await game.save()
    return game
  }

  return game
}

export default fetchGameDetails
