import { Schema, model } from 'mongoose'

import { GameDetailsDoc } from './types'

const GameDetailsSchema = new Schema({
  type: String,
  name: String,
  steam_appid: Number,
  required_age: Number,
  is_free: Boolean,
  dlc: [Number],
  detailed_description: String,
  about_the_game: String,
  short_description: String,
  supported_languages: String,
  header_image: String,
  website: String,
  pc_requirements: {
    minimum: String
  },
  mac_requirements: {
    minimum: String
  },
  linux_requirements: {
    minimum: String
  },
  developers: [String],
  publishers: [String],
  demos: [
    {
      appid: Number,
      description: String
    }
  ],
  price_overview: {
    currency: String,
    initial: Number,
    final: Number,
    discount_percent: Number,
    initial_formatted: String,
    final_formatted: String
  },
  packages: [Number],
  package_groups: [
    {
      name: String,
      title: String,
      description: String,
      selection_text: String,
      save_text: String,
      display_type: Number,
      is_recurring_subscription: String,
      subs: [
        {
          packageid: Number,
          percent_savings_text: String,
          percent_savings: Number,
          option_text: String,
          option_description: String,
          can_get_free_license: String,
          is_free_license: Boolean,
          price_in_cents_with_discount: Number
        }
      ]
    }
  ],
  platforms: {
    windows: Boolean,
    mac: Boolean,
    linux: Boolean
  },
  metacritic: {
    score: Number,
    url: String
  },
  categories: [
    {
      id: Number,
      description: String
    }
  ],
  genres: [
    {
      id: Number,
      description: String
    }
  ],
  screenshots: [
    {
      id: Number,
      path_thumbnail: String,
      path_full: String
    }
  ],
  movies: [
    {
      id: Number,
      name: String,
      thumbnail: String,
      webm: {
        '480': String,
        max: String
      },
      mp4: {
        '480': String,
        max: String
      },
      highlight: Boolean
    }
  ],
  recommendations: {
    total: Number
  },
  achievements: {
    total: Number,
    highlighted: [
      {
        name: String,
        path: String
      }
    ]
  },
  release_date: {
    coming_soon: Boolean,
    date: String
  },
  support_info: {
    url: String,
    email: String
  },
  background: String,
  content_descriptors: {
    ids: [Number],
    notes: String
  }
})

export default model<GameDetailsDoc>('GameDetails', GameDetailsSchema)
