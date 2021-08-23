import { Router } from 'express'

import MainController from '../controllers/MainController'

const router = Router()
const mainController = new MainController()

router.route('/favorite').post(mainController.setFavorite)

router.get('/:id', mainController.getGame)
router.get('/', mainController.getGames)

export default router
