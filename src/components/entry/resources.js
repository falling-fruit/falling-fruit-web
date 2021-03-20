import EatTheWeedsLogo from './icons/EatTheWeeds.png'
import ForagingTexasLogo from './icons/ForagingTexas.png'
import FruitipediaLogo from './icons/Fruitipedia.png'
import UrbanMushroomsLogo from './icons/UrbanMushrooms.png'
import USDALogo from './icons/USDA.svg'
import WikipediaLogo from './icons/Wikipedia.svg'

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
    urlKey: 'usda_symbol',
    urlFormatter: (url) => `https://plants.usda.gov/core/profile?symbol=${url}`,
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
