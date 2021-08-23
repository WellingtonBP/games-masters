import { Document } from 'mongoose'

type Game = {
  appid: number
  name?: string
}
type GameDoc = Document & Game

type GameDetailsData = {
  type: string
  name: string
  steam_appid: number
  required_age: number
  is_free: boolean
  dlc: number[]
  detailed_description: string
  about_the_game: string
  short_description: string
  supported_languages: string
  header_image: string
  website: string
  pc_requirements: {
    minimum: string
  }
  mac_requirements: {
    minimum: string
  }
  linux_requirements: {
    minimum: string
  }
  developers: string[]
  publishers: string[]
  demos: {
    appid: number
    description: string
  }[]
  price_overview: {
    currency: string
    initial: number
    final: number
    discount_percent: number
    initial_formatted: string
    final_formatted: string
  }
  packages: number[]
  package_groups: {
    name: string
    title: string
    description: string
    selection_text: string
    save_text: string
    display_type: number
    is_recurring_subscription: string
    subs: {
      packageid: number
      percent_savings_text: string
      percent_savings: number
      option_text: string
      option_description: string
      can_get_free_license: string
      is_free_license: boolean
      price_in_cents_with_discount: number
    }[]
  }[]
  platforms: {
    windows: boolean
    mac: boolean
    linux: boolean
  }
  metacritic: {
    score: number
    url: string
  }
  categories: {
    id: number
    description: string
  }[]
  genres: {
    id: number
    description: string
  }[]
  screenshots: {
    id: number
    path_thumbnail: string
    path_full: string
  }[]
  movies: {
    id: number
    name: string
    thumbnail: string
    webm: {
      '480': string
      max: string
    }
    mp4: {
      '480': string
      max: string
    }
    highlight: boolean
  }[]
  recommendations: {
    total: number
  }
  achievements: {
    total: number
    highlighted: {
      name: string
      path: string
    }[]
  }
  release_date: {
    coming_soon: boolean
    date: string
  }
  support_info: {
    url: string
    email: string
  }
  background: string
  content_descriptors: {
    ids: number[]
    notes: string
  }
}
type GameDetailsResponse = Record<
  string,
  {
    success: boolean
    data: GameDetailsData
  }
>
type GameDetailsDoc = Document & GameDetailsData

type CustomError = Error & {
  customMessage?: string
  status?: number
}

export {
  Game,
  GameDoc,
  GameDetailsData,
  GameDetailsDoc,
  GameDetailsResponse,
  CustomError
}
