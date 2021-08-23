import { Request, Response, NextFunction } from 'express'
import axios from 'axios'

import Game from '../models/Game'
import GameDetails, { fields as acceptFields } from '../models/GameDetails'
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
          const error: CustomError = new Error()
          error.status = 404
          error.customMessage = "We can't find this game"
          throw error
        }
        game = new GameDetails(responseData[id].data)
        await game.save()
      }

      const searchedFields = fields
        ? String(fields)
            .split(',')
            .filter(field => acceptFields.includes(field))
        : []

      res
        .status(200)
        .json(
          searchedFields.length
            ? Object.fromEntries(
                Object.entries(game.toJSON()).filter(([field, value]) =>
                  searchedFields.includes(field)
                )
              )
            : game
        )
    } catch (err) {
      next(err)
    }
  }
}

export default MainController
