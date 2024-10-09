import styled from 'styled-components/macro'

import PhotoGridTemplate from './AboutPhotoGrid'
import { PageScrollWrapper, PageTemplate } from './PageTemplate'

const foragingPhotos = [
  {
    link: 'https://fallingfruit.org/ethan-oranges.jpg',
    alt: 'ethan oranges',
  },
  {
    link: 'https://fallingfruit.org/jeff-tree.jpg',
    alt: 'jeff tree',
  },
  {
    link: 'https://fallingfruit.org/plums.jpg',
    alt: 'plums',
  },
  {
    link: 'https://fallingfruit.org/amittai-mulberries.jpg',
    alt: 'amittai mulberries',
  },
]

const PointerButton = styled.button`
  cursor: pointer;
`

const Project = () => (
  <PageScrollWrapper>
    <PageTemplate from="Settings">
      <div className="grid">
        <PhotoGridTemplate photos={foragingPhotos} float={'right'} />
        <p>
          <em>
            Falling Fruit is not associated with Fallen Fruit. Fallen Fruit can
            be found at <a href="https://fallenfruit.org">fallenfruit.org</a>.
          </em>
        </p>
        <h3>Donate</h3>
        <p>
          <em>
            We are a 501(c)(3) nonprofit and rely on donations to operate. If
            you are willing and able, please consider making a financial
            contribution. Donations within the United States are tax deductible.
          </em>
          <br />
          <br />
          <form action="https://www.paypal.com/us/fundraiser/charity/1387793">
            <PointerButton type="submit">
              Donate via Paypal Giving Fund
            </PointerButton>
          </form>
        </p>
        <h3>Write</h3>
        <p>
          <em>
            Falling Fruit is built by and for foragers – we want it to be the
            best tool available to the contemporary forager. Write us at{' '}
            <a href="mailto:info@fallingfruit.org">info@fallingfruit.org</a>, we
            would love to hear from you!
          </em>
        </p>
        <h3>Translate</h3>
        <p>
          <em>
            Interested in volunteering as a translator? Email us and we'll
            invite you to join us on <a href="https://phrase.com">Phrase</a>,
            where our translations are managed.
          </em>
        </p>
        <h2>About the project</h2>
        <p>
          Falling Fruit is a celebration of the overlooked culinary bounty of
          our city streets. By quantifying this resource on an interactive map,
          we hope to facilitate intimate connections between people, food, and
          the natural organisms growing in our neighborhoods. Not just a free
          lunch! Foraging in the 21st century is an opportunity for urban
          exploration, to fight the scourge of stained sidewalks, and to
          reconnect with the botanical origins of food.
        </p>
        <p>
          Our edible map is not the first of its kind, but it aspires to be the
          world's most comprehensive. While our users contribute locations of
          their own, we comb the internet for pre-existing knowledge, seeking to
          unite the efforts of foragers, foresters, and freegans everywhere. The{' '}
          <a href="/data">imported datasets</a> range from small neighborhood
          foraging maps to vast professionally-compiled tree inventories. This
          so far amounts to thousands of different types of edibles (most, but
          not all, plant species) distributed over millions of locations. Beyond
          the cultivated and commonplace to the exotic flavors of foreign plants
          and long-forgotten native plants, foraging in your neighborhood is a
          journey through time and across cultures.
        </p>
        <p>
          Join us in celebrating hyper-local food! The <a href="/map">map</a> is
          open for anyone to edit, the database can be{' '}
          <a href="/data">downloaded</a> with just one click, and the{' '}
          <a href="https://github.com/falling-fruit">code</a> is open-source.
          You are likewise encouraged to share the bounty with your fellow
          humans. Our <a href="/sharing">sharing page</a> lists hundreds of
          local organizations - planting public orchards and food forests,
          picking otherwise-wasted fruits and vegetables from city trees and
          farmers' fields, and sharing with neighbors and the needy.
        </p>
      </div>
      <h2>Staff</h2>
      <div className="content">
        <img src="https://fallingfruit.org/ethan_welty.jpg" alt="" />
        <div className="div-aux"></div>
        <p>
          <em>Executive Director</em>
          <br />
          <b>Ethan Welty</b>
          <br />
          <a href="mailto:ethan@fallingfruit.org">ethan@fallingfruit.org</a>
          <br />
          Zürich, Switzerland
          <br />
          <br />
          With technology and data, Ethan champions cities as sources of fresh
          and free food. He created Falling Fruit with Caleb Phillips in 2013 to
          promote urban foraging worldwide, and co-founded{' '}
          <a href="https://fruitrescue.org/">Community Fruit Rescue</a> in 2014
          to harvest and distribute surplus fruit growing around him in Boulder,
          Colorado. Beyond fruit, he juggles a{' '}
          <a href="https://www.weltyphotography.com/index">
            photography career
          </a>
          ,{' '}
          <a href="https://instaar.colorado.edu/people/ethan-welty/">
            research on glaciers
          </a>
          , and an appetite for mountainous and riverine pursuits.
        </p>
      </div>
      <h2>Board of directors</h2>
      <div className="content">
        <img src="https://fallingfruit.org/jeff_wanner.jpg" alt="" />
        <div className="div-aux"></div>
        <p>
          <em>President</em>
          <br />
          <b>Jeff Wanner</b>
          <br />
          <a href="mailto:jeff@fallingfruit.org">jeff@fallingfruit.org</a>
          <br />
          Boulder, Colorado, USA
          <br />
          <br />
          Since harvesting black and blueberries with his family as a child and,
          more recently, noticing the wealth of public fruit trees throughout
          Colorado, Jeff has developed a deep appreciation for the abundance of
          fruit growing in our cities. His first mission for Falling Fruit was
          to comb Boulder and Salt Lake City, paper maps in-hand, to record
          fruiting trees. When not working to improve building energy
          efficiency, he is usually helping out in the community or moving
          quickly over mountains by foot, ski, or bicycle.
        </p>
      </div>
      <div className="content">
        <img src="https://fallingfruit.org/craig_durkin.jpg" alt="" />
        <div className="div-aux"></div>
        <p>
          <b>Craig Durkin</b>
          <br />
          Atlanta, Georgia, USA
          <br />
          <br />
          Craig is the co-founder of{' '}
          <a href="https://www.concrete-jungle.org/">Concrete Jungle</a>, an
          organization in Atlanta, Georgia which grows food and picks fruit
          throughout the city for donation to local homeless shelters and food
          banks. As a <a href="https://www.gatech.edu/">Georgia Tech</a>{' '}
          graduate, he's always looking for ways to combine fruit picking with
          new technologies, and will soon be deploying his fruit-tree spotting
          drone and tweeting fruit-ripeness sensor...
        </p>
      </div>
      <div className="content">
        <img src="https://fallingfruit.org/emily_sigman.jpg" alt="" />
        <div className="div-aux"></div>
        <p>
          <b>Emily Sigman</b>
          <br />
          New Haven, Connecticut, USA
          <br />
          <br />
          Emily is a diehard agroforestry evangelist, incorrigible forager, and
          proud mother to two cats, four quails, and the world's most
          magnificent canine. Her roots stretch deep into the Rocky Mountains,
          but these days her aboveground biomass is proud to call New Haven,
          Connecticut her home. She can often be found tending public food
          forests, reading enraptured in some cozy library corner, or waxing
          poetic about the magic of mycelium (and, supposedly, completing joint
          graduate degrees at the Yale{' '}
          <a href="https://environment.yale.edu/">
            {' '}
            School of Forestry
          </a> and{' '}
          <a href="https://jackson.yale.edu/person/emily-sigman/">
            School of Global Affairs
          </a>
          ). Emily harbors a devastating addiction to travel, and could be just
          about anywhere right now.
        </p>
      </div>
      <h2>Board of advisors</h2>
      <div className="content">
        <img src="https://fallingfruit.org/alan_gibson.jpg" alt="" />
        <div className="div-aux"></div>
        <p>
          <b>Alan Gibson</b>
          <br />
          Southampton, United Kingdom
          <br />
          <br />
          Alan has always enjoyed adventures and exploring. He began foraging as
          a way to introduce his young children to the outdoors lifestyle. He
          writes the{' '}
          <a href="https://theurbaneforager.blogspot.com/">
            Urbane Forager
          </a>{' '}
          blog and published the{' '}
          <a href="https://www.amazon.co.uk/Urbane-Forager-Fruit-Nuts-Free/dp/1785073001">
            Urbane Forager: Fruit and Nuts For Free
          </a>{' '}
          book. He has legitimised foraging in public parks and established a
          community orchard in his home town, Southampton UK.
        </p>
      </div>
      <div className="content">
        <img src="https://fallingfruit.org/ana_carolina_de_lima.jpg" alt="" />
        <div className="div-aux"></div>
        <p>
          <b>Ana Carolina de Lima</b>
          <br />
          Silver City, New Mexico, USA
          <br />
          <br />
          Ana is a postdoctoral researcher at the Federal University of Pará in
          Brazil. She is an anthropologist interested in understanding social
          and cultural diet habits. Ana worked mostly in the Brazilian Amazon.
          In Acre (western Amazon) she studied regional fruit consumption. Then,
          she worked in the Middle Solimões region, investigating diet change in
          remote communities. Between 2017 and 2018, Ana lived in small and
          medium towns of the Amazon Delta, looking at the effects of climate
          change on the food security of people living in informal settlements.
          She recently moved to southern New Mexico in the United States, where
          she works as a consultant.
        </p>
      </div>
      <div className="content">
        <img src="https://fallingfruit.org/caleb_phillips.jpg" alt="" />
        <div className="div-aux"></div>
        <p>
          <b>Caleb Phillips</b>
          <br />
          Boulder, Colorado, USA
          <br />
          <br />
          Caleb is a featherless bipedal humanoid passionate about food justice
          and finding creative ways to use technology to address social issues.
          When he's not biking around gawking at trees, he balances his efforts
          between his day job as a data scientist at the{' '}
          <a href="https://www.nrel.gov/research/caleb-phillips.html">
            National Renewable Energy Laboratory
          </a>{' '}
          in Golden, Colorado and as an adjunct professor of computer science at
          the University of Colorado. Besides all that work stuff, he likes to
          climb rocks, run trails, ride bikes, and generally be outdoors as much
          as possible. Caleb created Falling Fruit with Ethan Welty in 2013 and
          served on the board of directors for 6 years before taking a position
          on the Advisory Board.
        </p>
      </div>
      <div className="content">
        <img src="https://fallingfruit.org/cristina_rubke.jpg" alt="" />
        <div className="div-aux"></div>
        <p>
          <b>Cristina Rubke</b>
          <br />
          San Francisco, California, USA
          <br />
          <br />
          Cristina is an attorney with{' '}
          <a href="https://www.sflaw.com/attorney/cristina-n-rubke/">
            Shartsis Friese LLP
          </a>{' '}
          in San Francisco, California, where she focuses on trademark
          prosecution and counseling. She is also a board member of the{' '}
          <a href="https://www.sfmta.com/">
            San Francisco Municipal Transportation Agency
          </a>
          , which oversees public transportation, traffic and parking in San
          Francisco. In her spare time, Cristina sails the San Francisco Bay
          with the{' '}
          <a href="https://www.baads.org/">
            Bay Area Association of Disabled Sailors
          </a>{' '}
          and competes in local and international regattas.
        </p>
      </div>
      <div className="content">
        <img src="https://fallingfruit.org/david_craft.jpg" alt="" />
        <div className="div-aux"></div>
        <p>
          <b>David Craft</b>
          <br />
          Cambridge, Massachusetts, USA
          <br />
          <br />
          David is a researcher in the Department of Radiation Oncology at the{' '}
          <a href="https://gray.mgh.harvard.edu/index.php?option=com_content&view=article&id=4:david-craft-phd&catid=1:f">
            Harvard Medical School
          </a>{' '}
          in Boston, Massachusetts. He is also an avid forager and author of the
          book{' '}
          <a href="https://www.amazon.com/Urban-Foraging-finding-eating-plants-ebook/dp/B003LSTEGO/">
            Urban Foraging: Finding and Eating Wild Plants in the City
          </a>{' '}
          (free download).
        </p>
      </div>
      <div className="content">
        <img src="https://fallingfruit.org/tristram_stuart.jpg" alt="" />
        <div className="div-aux"></div>
        <p>
          <b>Tristram Stuart</b>
          <br />
          United Kingdom
          <br />
          <br />
          As a teenager, Tristram raised pigs on surplus food that he collected
          from his school kitchens, the local baker and village greengrocer.
          Noticing that a lot of this food was still suitable for human
          consumption led him to the realization that good, fresh food was being
          wasted on a colossal scale. Tristram has since worked tirelessly to
          bring this issue to the attention of the public, the media, and
          policy-makers. He founded the food waste campaign organization{' '}
          <a href="https://feedbackglobal.org/"> Feedback Global</a> and wrote{' '}
          <a href="https://www.tristramstuart.co.uk/">
            Waste: Uncovering the Global Food Scandal
          </a>{' '}
          to demonstrate the extent of the problem on a global scale. In 2011,
          Tristram was awarded{' '}
          <a href="https://www.sofieprisen.no/Prize_Winners/2011/index.html">
            The Sophie Prize
          </a>{' '}
          for his fight against food waste.
        </p>
      </div>

      <h2>Translators</h2>

      <p>
        <b>
          Amit Baum (<span dir="rtl">עמית באום</span>)
        </b>{' '}
        – עִברִית
        <br />
        <b dir="ltr">Ana Carolina de Lima</b> – Português
        <br />
        <b dir="ltr">Daniela Marini</b> – Español
        <br />
        <b>David Katzin</b> – עִברִית
        <br />
        <b dir="ltr">Ethan Welty</b> – Français, Español
        <br />
        <b dir="ltr">Heimen Stoffels</b> – Nederlands
        <br />
        <b dir="ltr">Jadalnia Warszawa</b> – Polski
        <br />
        <b dir="ltr">Karolina Hansen</b> - Polski
        <br />
        <b dir="ltr">Kira Dell</b> – Português, Español
        <br />
        <b dir="ltr">Laura Clabé</b> – Français
        <br />
        <b dir="ltr">Liana Welty</b> – Español
        <br />
        <b dir="ltr">Lola Ortiz</b> – Español
        <br />
        <b dir="ltr">Maria Noel Silvera</b> – Español
        <br />
        <b dir="ltr">Maria Rosa Puig</b> – Español
        <br />
        <b dir="ltr">Michela Pasquali</b> – Italiano
        <br />
        <b dir="ltr">Monica Breval Listán</b> – Español
        <br />
        <b dir="ltr">Mylène Jacquemart</b> – Deutsch, Italiano
        <br />
        <b dir="ltr">Parmenter Welty</b> – Español
        <br />
        <b dir="ltr">Raven Lyn</b> – Português
        <br />
        <b dir="ltr">Salomé Martin</b> – Français
        <br />
        <b dir="ltr">Sifis Diamantidis</b> - Ελληνικά
        <br />
        <b dir="ltr">Thomaz Brandão Teixeira</b> – Português
        <br />
        <b dir="ltr">Tim Conze</b> – Svenska
        <br />
        <b>Timna Raz</b> – עִברִית
        <br />
      </p>

      <h2>Closing remarks</h2>
      <p>
        Falling Fruit is a 501(c)(3) (tax-exempt) public charity based in
        Boulder, Colorado. As a result, donations within the United States are
        tax deductible. You may review our{' '}
        <a href="https://fallingfruit.org/501c3.pdf">letter of exemption</a>{' '}
        from the IRS and verify our standing with{' '}
        <a href="https://apps.irs.gov/app/eos/pub78Search.do?">
          IRS Publication 78
        </a>{' '}
        or the{' '}
        <a href="https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do?resetTransTyp=Y">
          Colorado Secretary of State
        </a>
        . Also available are our{' '}
        <a href="https://docs.google.com/document/d/18E7PiiYbReq2c3BKYzxjHphiXsdtvkW-14UcN5y_5P4/edit?usp=sharing">
          bylaws
        </a>{' '}
        and board meeting{' '}
        <a href="https://docs.google.com/document/d/1fzqYZ7rxYfeVqDuvI_uAyWhKm50RilqdTz6oxx3Ohw4">
          minutes
        </a>
        .
      </p>
      <blockquote>
        Falling Fruit
        <br />
        535 S 44th St, Boulder, CO 80305, USA
        <br />
        EIN: 46-5363428
      </blockquote>
      <p>
        Harvesting food in an urban setting comes with certain practical and
        moral considerations. For an introduction to the ethics of urban
        foraging, we recommend the following{' '}
        <a href="https://docs.google.com/document/d/1SupIGQKC5Vgi3VYkdIQc05y_S7jSoZ4RTS-CzwlEAMY">
          summary
        </a>
        .
      </p>
      <p>
        Information on Falling Fruit may be wrong or out of date. For example,
        many of the foraging maps migrated to Falling Fruit were hosted as
        public Google Maps on which markers were often moved accidentally, and
        municipal tree inventories are updated only (if ever) as trees are
        visited for maintenance. Be prepared to encounter inaccuracies in the
        field, and please edit the map as needed based on your discoveries.
        Ultimately, it is your responsibility to determine the identity,
        edibility, and location of a plant, and the responsibility of all to
        improve the quality of the map.
      </p>
    </PageTemplate>
  </PageScrollWrapper>
)

export default Project
