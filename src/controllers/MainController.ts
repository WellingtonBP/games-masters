import { Request, Response, NextFunction } from 'express'

import Game from '../models/Game'
import Favorite from '../models/Favorite'
import fetchGameDetails from '../utils/fetchGameDetails'
import filterFields from '../utils/filterFields'
import { CustomError } from '../types'

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

      if (!Number(id)) {
        const error: CustomError = new Error()
        error.status = 422
        error.customMessage = 'Invalid id'
        throw error
      }

      let game = await fetchGameDetails(Number(id))

      if (!game) {
        const error: CustomError = new Error()
        error.status = 404
        error.customMessage = "We can't find this game"
        throw error
      }

      res
        .status(200)
        .json(fields ? await filterFields(String(fields), game) : game)
    } catch (err) {
      next(err)
    }
  }

  async setFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const { rating, gameid } = req.body
      const userHash = req.get('user-hash')

      if (!userHash || !Number(gameid)) {
        const error: CustomError = new Error()
        error.status = 422
        let message = ''
        if (!userHash) {
          message += '\n user-hash header not found'
        }
        if (!Number(gameid)) {
          message += '\n invalid game id'
        }
        error.customMessage = message
        throw error
      }

      if (Number(rating) && !(Number(rating) > 0 && Number(rating) <= 5)) {
        const error: CustomError = new Error()
        error.status = 422
        error.customMessage = 'Invalid rating, must be between 0 and 5'
        throw error
      }

      const game = await fetchGameDetails(Number(gameid))
      if (!game) {
        const error: CustomError = new Error()
        error.status = 404
        error.customMessage = "We can't find this game"
        throw error
      }

      let favoritesList = await Favorite.findOne({ userHash })
      if (!favoritesList) {
        favoritesList = new Favorite({ userHash, games: [] })
      }

      const indexInList = favoritesList.games.findIndex(
        game => Number(game.id) === Number(gameid)
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

      res.status(201).json({ message: 'ok' })
    } catch (err) {
      next(err)
    }
  }
}

export default MainController
