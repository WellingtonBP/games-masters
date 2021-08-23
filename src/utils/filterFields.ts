import { GameDetailsDoc, GameDetailsData } from '../types'

const acceptFields = [
  'type',
  'name',
  'steam_appid',
  'required_age',
  'is_free',
  'dlc',
  'detailed_description',
  'about_the_game',
  'short_description',
  'supported_languages',
  'header_image',
  'website',
  'pc_requirements',
  'mac_requirements',
  'linux_requirements',
  'developers',
  'publishers',
  'demos',
  'price_overview',
  'packages',
  'package_groups',
  'platforms',
  'metacritic',
  'categories',
  'genres',
  'screenshots',
  'movies',
  'recommendations',
  'achievements',
  'release_date',
  'support_info',
  'background',
  'content_descriptors'
]

async function filterFields(
  fields: string,
  game: GameDetailsDoc
): Promise<Partial<GameDetailsData>> {
  const searchedFields = fields
    ? String(fields)
        .split(',')
        .filter(field => acceptFields.includes(field))
    : []

  return Object.fromEntries(
    Object.entries(game.toJSON()).filter(([field, value]) =>
      searchedFields.includes(field)
    )
  )
}

export default filterFields
