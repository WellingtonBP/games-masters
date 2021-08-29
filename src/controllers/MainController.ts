import { Request, Response, NextFunction } from 'express'

import Game from '../models/Game'
import Favorite from '../models/Favorite'
import fetchGameDetails from '../utils/fetchGameDetails'
import { CustomError, GameDetailsData } from '../types'

async function filterFields(
  fields: string,
  game: GameDetailsData
): Promise<Partial<GameDetailsData>> {
  return Object.fromEntries(
    Object.entries(game).filter(([field, value]) => fields.includes(field))
  )
}
function checkUserHash(userHash?: string): never | void {
  if (!userHash) {
    const error: CustomError = new Error()
    error.status = 403
    error.customMessage = 'user-hash header not found'
    throw error
  }
}

// Controller
class MainController {
  async getGames(req: Request, res: Response, next: NextFunction) {
    try {
      const { offset, limit } = req.query
      const games = await Game.find()
        .skip(Number(offset) || 0)
        .limit(Number(limit) || 300)
        .select('-_id')

      res.status(200).json(games)
    } catch (err) {
      next(err)
    }
  }

  async getGame(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { fields } = req.query

      let game = await fetchGameDetails(Number(id))

      res
        .status(200)
        .json(fields ? await filterFields(String(fields), game!) : game)
    } catch (err) {
      next(err)
    }
  }

  async setFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const { rating, appid } = req.body
      const userHash = req.get('user-hash')

      checkUserHash(userHash)

      if (Number(rating) && !(Number(rating) > 0 && Number(rating) <= 5)) {
        const error: CustomError = new Error()
        error.status = 422
        error.customMessage = 'Invalid rating, must be between 0 and 5'
        throw error
      }

      await fetchGameDetails(Number(appid))

      let favoritesList = await Favorite.findOne({ userHash })
      if (!favoritesList) {
        favoritesList = new Favorite({ userHash, games: [] })
      }

      const indexInList = favoritesList.games.findIndex(
        game => game.id === Number(appid)
      )
      const favorite = {
        id: Number(appid),
        rating: Number(rating) || undefined
      }
      if (indexInList !== -1) {
        favoritesList.games[indexInList] = favorite
      } else {
        favoritesList.games.push(favorite)
      }

      await favoritesList.save()

      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  async getFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userHash = req.get('user-hash')
      const { fields } = req.query

      checkUserHash(userHash)

      const favoriteList = await Favorite.findOne(
        { userHash },
        { _id: 0, __v: 0 }
      )

      if (!favoriteList) {
        return res.status(200).json([])
      }

      const games: Partial<GameDetailsData> & { rating?: number }[] = []

      for (const favoriteGame of favoriteList!.games) {
        const gameDetails = await fetchGameDetails(favoriteGame.id)
        const filteredGameDetails = games.push({
          ...(fields
            ? await filterFields(String(fields), gameDetails)
            : gameDetails),
          rating: favoriteGame.rating
        })
      }

      res.status(200).json(games)
    } catch (err) {
      next(err)
    }
  }

  async delFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userHash = req.get('user-hash')
      const { id } = req.params

      checkUserHash(userHash)

      const favoriteList = await Favorite.findOne({ userHash })

      if (!favoriteList) {
        return res.status(204).end()
      }

      favoriteList.games = favoriteList.games.filter(
        game => game.id !== Number(id)
      )

      await favoriteList!.save()

      res.status(200).json({
        message: 'success'
      })
    } catch (err) {
      next(err)
    }
  }
}

export default MainController
