import { Schema, model } from 'mongoose'

import { GameDoc } from '../types'

const GameSchema = new Schema({
  appid: {
    type: Number,
    required: true
  },
  name: String
})

export default model<GameDoc>('Game', GameSchema)
