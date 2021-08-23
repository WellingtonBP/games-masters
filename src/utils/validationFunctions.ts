import { CustomError, GameDetailsDoc, FavoriteDoc } from '../types'

function checkUserHash(userHash?: string): never | void {
  if (!userHash) {
    const error: CustomError = new Error()
    error.status = 422
    error.customMessage = 'user-hash header not found'
    throw error
  }
}

function checkGameId(id?: number): never | void {
  if (!Number(id)) {
    const error: CustomError = new Error()
    error.status = 422
    error.customMessage = 'Invalid id'
    throw error
  }
}

function checkGame(game: GameDetailsDoc | null): never | void {
  if (!game) {
    const error: CustomError = new Error()
    error.status = 404
    error.customMessage = "We can't find this game"
    throw error
  }
}

function checkFavoriteList(list: FavoriteDoc | null): never | void {
  if (!list) {
    const error: CustomError = new Error()
    error.status = 404
    error.customMessage = "We can't find this user"
    throw error
  }
}

export { checkUserHash, checkGameId, checkGame, checkFavoriteList }
