import { Request, Response, NextFunction } from 'express'

import Game from '../models/Game'

class MainController {
  async getGames(req: Request, res: Response, next: NextFunction) {
    try {
      const { offset, limit } = req.query
      const games = await Game.find()
        .skip(Number(offset) || 0)
        .limit(Number(limit) || 0)
        .select('appid name -_id')

      res.status(200).json(games)
    } catch (err) {
      next(err)
    }
  }
}

export default MainController
