import { Schema, model } from 'mongoose'

import { FavoriteDoc } from '../types'

const FavoriteSchema = new Schema({
  userHash: {
    type: String,
    required: true
  },
  games: [
    {
      rating: Number,
      id: {
        type: Number,
        required: true
      }
    }
  ]
})

export default model<FavoriteDoc>('Favorite', FavoriteSchema)
