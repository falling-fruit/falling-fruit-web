import EatTheWeedsLogo from './icons/EatTheWeeds.svg'
import ForagingTexasLogo from './icons/ForagingTexas.png'
import FruitipediaLogo from './icons/Fruitipedia.png'
import UrbanMushroomsLogo from './icons/UrbanMushrooms.png'
import USDALogo from './icons/USDA.svg'
import WikipediaLogo from './icons/Wikipedia.svg'

/* TODO: Convert logos to original images instead of SVGs */
/**
 * Resource information for Entry Details. Includes the resource title,
 * url key, logo icon, and icon alt text.
 * @constant {Object[]}
 */
const RESOURCES = [
  {
    title: 'Eat the Weeds',
    urlKey: 'eat_the_weeds_url',
    icon: EatTheWeedsLogo,
    iconAlt: 'Eat the Weeds logo',
  },
  {
    title: 'Foraging Texas',
    urlKey: 'foraging_texas_url',
    icon: ForagingTexasLogo,
    iconAlt: 'Foraging Texas logo',
  },
  {
    title: 'Fruitipedia',
    urlKey: 'fruitipedia_url',
    icon: FruitipediaLogo,
    iconAlt: 'Fruitipedia logo',
  },
  {
    title: 'Urban Mushrooms',
    urlKey: 'urban_mushrooms_url',
    icon: UrbanMushroomsLogo,
    iconAlt: 'Urban Mushrooms logo',
  },
  {
    title: 'USDA',
    urlFormatter: (url) => `https://plants.usda.gov/core/profile?symbol=${url}`,
    urlKey: 'usda_symbol',
    icon: USDALogo,
    iconAlt: 'USDA logo',
  },
  {
    title: 'Wikipedia',
    urlKey: 'wikipedia_url',
    icon: WikipediaLogo,
    iconAlt: 'Wikipedia logo',
  },
]

export { RESOURCES }
