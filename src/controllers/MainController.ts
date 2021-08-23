import { Request, Response, NextFunction } from 'express'

import Game from '../models/Game'
import Favorite from '../models/Favorite'
import fetchGameDetails from '../utils/fetchGameDetails'
import filterFields from '../utils/filterFields'
import {
  checkFavoriteList,
  checkGame,
  checkGameId,
  checkUserHash
} from '../utils/validationFunctions'
import { CustomError, GameDetailsData } from '../types'

// Controller

class MainController {
  async getGames(req: Request, res: Response, next: NextFunction) {
    try {
      const { offset, limit } = req.query
      const games = await Game.find()
        .skip(Number(offset) || 0)
        .limit(Number(limit) || 0)
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

      checkGameId(Number(id))

      let game = await fetchGameDetails(Number(id))
      checkGame(game)

      res
        .status(200)
        .json(fields ? await filterFields(String(fields), game!) : game)
    } catch (err) {
      next(err)
    }
  }

  async setFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const { rating, gameid } = req.body
      const userHash = req.get('user-hash')

      checkUserHash(userHash)
      checkGameId(Number(gameid))

      if (Number(rating) && !(Number(rating) > 0 && Number(rating) <= 5)) {
        const error: CustomError = new Error()
        error.status = 422
        error.customMessage = 'Invalid rating, must be between 0 and 5'
        throw error
      }

      const game = await fetchGameDetails(Number(gameid))
      checkGame(game)

      let favoritesList = await Favorite.findOne({ userHash })
      if (!favoritesList) {
        favoritesList = new Favorite({ userHash, games: [] })
      }

      const indexInList = favoritesList.games.findIndex(
        game => game.id === Number(gameid)
      )
      if (indexInList !== -1) {
        favoritesList.games[indexInList] = {
          id: Number(gameid),
          rating: Number(rating)
        }
      } else {
        favoritesList.games.push({ id: Number(gameid), rating: Number(rating) })
      }

      await favoritesList.save()

      res.status(204).end()
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

      checkFavoriteList(favoriteList)

      const games: {
        game: Partial<GameDetailsData>
        rating?: number
      }[] = []

      for (const favoriteGame of favoriteList!.games) {
        const gameDetails = (await fetchGameDetails(favoriteGame.id))!
        games.push({
          game: fields
            ? await filterFields(String(fields), gameDetails)
            : gameDetails,
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
      checkGameId(Number(id))

      const favoriteList = await Favorite.findOne({ userHash })

      checkFavoriteList(favoriteList)

      favoriteList!.games = favoriteList!.games.filter(
        game => game.id !== Number(id)
      )

      await favoriteList!.save()

      res.status(204).end()
    } catch (err) {
      next(err)
    }
  }
}

export default MainController
