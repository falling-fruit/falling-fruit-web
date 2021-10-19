import PhotoGridTemplate from '../entry/NewPhotoGrid'
import { PageScrollWrapper, PageTemplate } from './PageTemplate'

const foraging_photos = [
  'https://fallingfruit.org/ethan-oranges.jpg',
  'https://fallingfruit.org/jeff-tree.jpg',
  'https://fallingfruit.org/plums.jpg',
  'https://fallingfruit.org/amittai-mulberries.jpg',
]
const ethan_photo = ['https://fallingfruit.org/ethan_welty.jpg']
const jeff_photo = ['https://fallingfruit.org/jeff_wanner.jpg']
const craig_photo = ['https://fallingfruit.org/craig_durkin.jpg']
const emily_photo = ['https://fallingfruit.org/emily_sigman.jpg']
const alan_photo = ['https://fallingfruit.org/alan_gibson.jpg']
const ana_photo = ['https://fallingfruit.org/ana_carolina_de_lima.jpg']
const caleb_photo = ['https://fallingfruit.org/caleb_phillips.jpg']
const cristina_photo = ['https://fallingfruit.org/cristina_rubke.jpg']
const david_photo = ['https://fallingfruit.org/david_craft.jpg']
const Project = () => (
  <PageScrollWrapper>
    <PageTemplate>
      <PhotoGridTemplate photos={foraging_photos} float={'right'} />
      <p>
        <em>
          Falling Fruit is not associated with Fallen Fruit. Fallen Fruit can be
          found at fallenfruit.org.
        </em>
      </p>
      <h3>Donate</h3>
      <p>
        <em>
          We are a 501(c)(3) nonprofit and rely on donations to operate. If you
          are willing and able, please consider making a financial contribution.
          Donations within the United States are tax deductible.
        </em>
      </p>
      <h3>Write</h3>
      <p>
        <em>
          Falling Fruit is built by and for foragers – we want it to be the best
          tool available to the contemporary forager. Write us at
          <a href="feedback@fallingfruit.org"> feedback@fallingfruit.org</a>, we
          would love to hear from you!
        </em>
      </p>
      <h3>Translate</h3>
      <p>
        <em>
          Interested in volunteering as a translator? Email us and we'll invite
          you to join us on Phrase, where our translations are managed.
        </em>
      </p>
      <h2>About the project</h2>
      <p>
        Falling Fruit is a celebration of the overlooked culinary bounty of our
        city streets. By quantifying this resource on an interactive map, we
        hope to facilitate intimate connections between people, food, and the
        natural organisms growing in our neighborhoods. Not just a free lunch!
        Foraging in the 21st century is an opportunity for urban exploration, to
        fight the scourge of stained sidewalks, and to reconnect with the
        botanical origins of food. Our edible map is not the first of its kind,
        but it aspires to be the world's most comprehensive. While our users
        contribute locations of their own, we comb the internet for pre-existing
        knowledge, seeking to unite the efforts of foragers, foresters, and
        freegans everywhere. The imported datasets range from small neighborhood
        foraging maps to vast professionally-compiled tree inventories. This so
        far amounts to 2,959 different types of edibles (most, but not all,
        plant species) distributed over 1,478,212 locations. Beyond the
        cultivated and commonplace to the exotic flavors of foreign plants and
        long-forgotten native plants, foraging in your neighborhood is a journey
        through time and across cultures. Join us in celebrating hyper-local
        food! The map is open for anyone to edit, the database can be downloaded
        with just one click, and the code is open-source. You are likewise
        encouraged to share the bounty with your fellow humans. Our sharing page
        lists hundreds of local organizations - planting public orchards and
        food forests, picking otherwise-wasted fruits and vegetables from city
        trees and farmers' fields, and sharing with neighbors and the needy.
      </p>
      <h2>Staff</h2>
      <PhotoGridTemplate photos={ethan_photo} float={'left'} />
      <p>
        <em>Executive Director</em>
      </p>
      <p>
        <b>Ethan Welty</b>
      </p>
      <p>
        <a href="ethan@fallingfruit.org">ethan@fallingfruit.org</a>
      </p>
      <p>Zürich, Switzerland</p>
      <p>
        With technology and data, Ethan champions cities as sources of fresh and
        free food. He created Falling Fruit with Caleb Phillips in 2013 to
        promote urban foraging worldwide, and co-founded
        <a href="https://fruitrescue.org/"> Community Fruit Rescue</a> in 2014
        to harvest and distribute surplus fruit growing around him in Boulder,
        Colorado. Beyond fruit, he juggles a
        <a href="https://www.weltyphotography.com/index"> photography career</a>
        ,
        <a href="https://instaar.colorado.edu/people/ethan-welty/">
          {' '}
          research on glaciers
        </a>
        , and an appetite for mountainous and riverine pursuits.
      </p>
      <h2>Board of Directors</h2>
      <PhotoGridTemplate photos={jeff_photo} float={'left'} />
      <p>
        <em>President</em>
      </p>
      <p>
        <b>Jeff Wanner</b>
      </p>
      <p>
        <a href="jeff@fallingfruit.org">jeff@fallingfruit.org</a>
      </p>
      <p>Boulder, Colorado, USA</p>
      <p>
        Since harvesting black and blueberries with his family as a child and,
        more recently, noticing the wealth of public fruit trees throughout
        Colorado, Jeff has developed a deep appreciation for the abundance of
        fruit growing in our cities. His first mission for Falling Fruit was to
        comb Boulder and Salt Lake City, paper maps in-hand, to record fruiting
        trees. When not working to improve building energy efficiency, he is
        usually helping out in the community or moving quickly over mountains by
        foot, ski, or bicycle.
      </p>
      <PhotoGridTemplate photos={craig_photo} float={'left'} />
      <p>
        <b>Craig Durkin</b>
      </p>
      <p>Atlanta, Georgia, USA</p>
      <p>
        Craig is the co-founder of
        <a href="https://www.concrete-jungle.org/"> Concrete Jungle</a>, an
        organization in Atlanta, Georgia which grows food and picks fruit
        throughout the city for donation to local homeless shelters and food
        banks. As a <a href="https://www.gatech.edu/"> Georgia Tech</a>{' '}
        graduate, he's always looking for ways to combine fruit picking with new
        technologies, and will soon be deploying his fruit-tree spotting drone
        and tweeting fruit-ripeness sensor...
      </p>
      <PhotoGridTemplate photos={emily_photo} float={'left'} />
      <p>
        <b>Emily Sigman</b>
      </p>
      <p>New Haven, Connecticut, USA</p>
      <p>
        Emily is a diehard agroforestry evangelist, incorrigible forager, and
        proud mother to two cats, four quails, and the world's most magnificent
        canine. Her roots stretch deep into the Rocky Mountains, but these days
        her aboveground biomass is proud to call New Haven, Connecticut her
        home. She can often be found tending public food forests, reading
        enraptured in some cozy library corner, or waxing poetic about the magic
        of mycelium (and, supposedly, completing joint graduate degrees at the
        Yale
        <a href="https://environment.yale.edu/"> School of Forestry</a> and
        <a href="https://jackson.yale.edu/person/emily-sigman/">
          {' '}
          School of Global Affairs
        </a>
        ). Emily harbors a devastating addiction to travel, and could be just
        about anywhere right now.
      </p>
      <h2>Board of advisors</h2>
      <PhotoGridTemplate photos={alan_photo} float={'left'} />
      <p>
        <b>Alan Gibson</b>
      </p>
      <p>Southampton, United Kingdom</p>
      <p>
        Alan has always enjoyed adventures and exploring. He began foraging as a
        way to introduce his young children to the outdoors lifestyle. He writes
        the <a href="https://theurbaneforager.blogspot.com/"> Urbane Forager</a>{' '}
        blog and published the{' '}
        <a href="https://www.amazon.co.uk/Urbane-Forager-Fruit-Nuts-Free/dp/1785073001">
          Urbane Forager: Fruit and Nuts For Free
        </a>{' '}
        book. He has legitimised foraging in public parks and established a
        community orchard in his home town, Southampton UK.
      </p>
      <PhotoGridTemplate photos={ana_photo} float={'left'} />
      <p>
        <b>Ana Carolina de Lima</b>
      </p>
      <p>Silver City, New Mexico, USA</p>
      <p>
        Ana is a postdoctoral researcher at the Federal University of Pará in
        Brazil. She is an anthropologist interested in understanding social and
        cultural diet habits. Ana worked mostly in the Brazilian Amazon. In Acre
        (western Amazon) she studied regional fruit consumption. Then, she
        worked in the Middle Solimões region, investigating diet change in
        remote communities. Between 2017 and 2018, Ana lived in small and medium
        towns of the Amazon Delta, looking at the effects of climate change on
        the food security of people living in informal settlements. She recently
        moved to southern New Mexico in the United States, where she works as a
        consultant.
      </p>
      <PhotoGridTemplate photos={caleb_photo} float={'left'} />
      <p>
        <b>Caleb Phillips</b>
      </p>
      <p>Boulder, Colorado, USA</p>
      <p>
        Caleb is a featherless bipedal humanoid passionate about food justice
        and finding creative ways to use technology to address social issues.
        When he's not biking around gawking at trees, he balances his efforts
        between his day job as a data scientist at the{' '}
        <a href="https://www.nrel.gov/research/caleb-phillips.html">
          {' '}
          National Renewable Energy Laboratory
        </a>{' '}
        in Golden, Colorado and as an adjunct professor of computer science at
        the University of Colorado. Besides all that work stuff, he likes to
        climb rocks, run trails, ride bikes, and generally be outdoors as much
        as possible. Caleb created Falling Fruit with Ethan Welty in 2013 and
        served on the Board of Directors for 6 years before taking a position on
        the Advisory Board.
      </p>
      <PhotoGridTemplate photos={cristina_photo} float={'left'} />
      <p>
        <b>Cristina Rubke</b>
      </p>
      <p>San Francisco, California, USA</p>
      <p>
        Cristina is an attorney with{' '}
        <a href="https://www.sflaw.com/attorney/cristina-n-rubke/">
          {' '}
          Shartsis Friese LLP
        </a>{' '}
        in San Francisco, California, where she focuses on trademark prosecution
        and counseling. She is also a board member of the{' '}
        <a href="https://www.sfmta.com/">
          {' '}
          San Francisco Municipal Transportation Agency
        </a>
        , which oversees public transportation, traffic and parking in San
        Francisco. In her spare time, Cristina sails the San Francisco Bay with
        the{' '}
        <a href="https://www.baads.org/">
          {' '}
          Bay Area Association of Disabled Sailors
        </a>{' '}
        and competes in local and international regattas.
      </p>
      <PhotoGridTemplate photos={david_photo} float={'left'} />
      <p>
        <b>David Craft</b>
      </p>
      <p>Cambridge, Massachusetts, USA</p>
      <p>
        David is a researcher in the Department of Radiation Oncology at the{' '}
        <a href="https://gray.mgh.harvard.edu/index.php?option=com_content&view=article&id=4:david-craft-phd&catid=1:f">
          {' '}
          Harvard Medical School
        </a>{' '}
        in Boston, Massachusetts. He is also an avid forager and author of the
        book{' '}
        <a href="https://www.amazon.com/Urban-Foraging-finding-eating-plants-ebook/dp/B003LSTEGO/">
          {' '}
          Urban Foraging: Finding and Eating Wild Plants in the City
        </a>{' '}
        (free download).
      </p>
    </PageTemplate>
  </PageScrollWrapper>
)

export default Project
