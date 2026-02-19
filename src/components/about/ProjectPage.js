import { useTranslation } from 'react-i18next'

import { InfoPage } from '../ui/PageTemplate'
import PhotoGridTemplate from './AboutPhotoGrid'
import DonationButton from './DonationButton'

const foragingPhotos = [
  {
    link: '/ethan-oranges.jpg',
    alt: 'ethan oranges',
  },
  {
    link: '/jeff-tree.jpg',
    alt: 'jeff tree',
  },
  {
    link: '/plums.jpg',
    alt: 'plums',
  },
  {
    link: '/amittai-mulberries.jpg',
    alt: 'amittai mulberries',
  },
]

const Project = () => {
  const { t } = useTranslation()

  const renderHTML = (html) => (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  )

  return (
    <InfoPage>
      <div className="grid">
        <PhotoGridTemplate photos={foragingPhotos} float={'inline-end'} />
        <p>
          <em>{renderHTML(t('pages.about.ff_disclaimer_html'))}</em>
        </p>
        <h3>{t('pages.about.donate')}</h3>
        <p>
          <em>{t('pages.about.give_us_money')}</em>
        </p>
        <DonationButton />
        <h3>{t('pages.about.write')}</h3>
        <p>
          <em>{renderHTML(t('pages.about.contact_us_html'))}</em>
        </p>
        <h3>{t('pages.about.translate')}</h3>
        <p>
          <em>{renderHTML(t('pages.about.translate_for_us_html'))}</em>
        </p>
        <h2>{t('pages.about.about_the_site')}</h2>
        <p>{t('pages.about.celebration')}</p>
        <p>{renderHTML(t('pages.about.more_about_html'))}</p>
        <p>{renderHTML(t('pages.about.join_us_html'))}</p>
      </div>
      <h2>{t('pages.about.staff')}</h2>
      <div className="content">
        <img src="/ethan_welty.jpg" alt="" />
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
          {renderHTML(t('pages.about.ethan_welty_bio_html'))}
        </p>
      </div>
      <h2>{t('pages.about.directors')}</h2>
      <div className="content">
        <img src="/jeff_wanner.jpg" alt="" />
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
          {renderHTML(t('pages.about.jeff_wanner_bio_html'))}
        </p>
      </div>
      <div className="content">
        <img src="/ali_moxley.jpg" alt="" />
        <p>
          <b>Ali Moxley</b>
          <br />
          Bozeman, Montana, USA
          <br />
          <br />
          {renderHTML(t('pages.about.ali_moxley_bio_html'))}
        </p>
      </div>
      <div className="content">
        <img src="/austin_arrington.jpg" alt="" />
        <p>
          <b>Austin Arrington</b>
          <br />
          <a href="mailto:austin@plantgroup.co">austin@plantgroup.co</a>
          <br />
          Philadelphia, Pennsylvania, USA
          <br />
          <br />
          {renderHTML(t('pages.about.austin_arrington_bio_html'))}
        </p>
      </div>
      <div className="content">
        <img src="/billy_daniels.jpg" alt="" />
        <p>
          <b>Billy Daniels</b>
          <br />
          <a href="mailto:billy@fallingfruit.org">billy@fallingfruit.org</a>
          <br />
          Madison, Wisconsin, USA
          <br />
          <br />
          {renderHTML(t('pages.about.billy_daniels_bio_html'))}
        </p>
      </div>
      <div className="content">
        <img src="/jp_goguen.jpg" alt="" />
        <p>
          <b>JP Goguen</b>
          <br />
          Urbana, Illinois, USA
          <br />
          <br />
          {renderHTML(t('pages.about.jp_goguen_bio_html'))}
        </p>
      </div>
      <div className="content">
        <img src="/meagan_shelley.jpg" alt="" />
        <p>
          <b>Meagan Shelley</b>
          <br />
          Amherst, Virginia, USA
          <br />
          <br />
          {renderHTML(t('pages.about.meagan_shelley_bio_html'))}
        </p>
      </div>
      <div className="content">
        <img src="/ward_bullard.jpg" alt="" />
        <p>
          <b>Ward Bullard</b>
          <br />
          <a href="mailto:ward@fallingfruit.org">ward@fallingfruit.org</a>
          <br />
          Menlo Park, California, USA
          <br />
          <br />
          {renderHTML(t('pages.about.ward_bullard_bio_html'))}
        </p>
      </div>
      <h2>{t('pages.about.advisors')}</h2>
      <div className="content">
        <img src="/alan_gibson.jpg" alt="" />
        <p>
          <b>Alan Gibson</b>
          <br />
          Southampton, United Kingdom
          <br />
          <br />
          {renderHTML(t('pages.about.alan_gibson_bio_html'))}
        </p>
      </div>
      <div className="content">
        <img src="/ana_carolina_de_lima.jpg" alt="" />
        <p>
          <b>Ana Carolina de Lima</b>
          <br />
          Silver City, New Mexico, USA
          <br />
          <br />
          {renderHTML(t('pages.about.ana_carolina_bio_html'))}
        </p>
      </div>
      <div className="content">
        <img src="/caleb_phillips.jpg" alt="" />
        <p>
          <b>Caleb Phillips</b>
          <br />
          Boulder, Colorado, USA
          <br />
          <br />
          {renderHTML(t('pages.about.caleb_phillips_bio_html'))}
        </p>
      </div>
      <div className="content">
        <img src="/cristina_rubke.jpg" alt="" />
        <p>
          <b>Cristina Rubke</b>
          <br />
          San Francisco, California, USA
          <br />
          <br />
          {renderHTML(t('pages.about.cristina_rubke_bio_html'))}
        </p>
      </div>
      <div className="content">
        <img src="/david_craft.jpg" alt="" />
        <p>
          <b>David Craft</b>
          <br />
          Cambridge, Massachusetts, USA
          <br />
          <br />
          {renderHTML(t('pages.about.david_craft_bio_html'))}
        </p>
      </div>
      <div className="content">
        <img src="/tristram_stuart.jpg" alt="" />
        <p>
          <b>Tristram Stuart</b>
          <br />
          United Kingdom
          <br />
          <br />
          {renderHTML(t('pages.about.tristram_stuart_bio_html'))}
        </p>
      </div>

      <h2>{t('pages.about.translators')}</h2>

      <p>
        <b dir="ltr">Amit Baum</b> (<b dir="rtl">עמית באום</b>) –{' '}
        <span dir="rtl">עִברִית</span>
        {' · '}
        <b dir="ltr">Ana Carolina de Lima</b> – <span dir="ltr">Português</span>
        {' · '}
        <b dir="ltr">Anya Sytenkova</b> (<b dir="ltr">Аня Сытенкова</b>) –
        <span dir="ltr">Русский</span>
        {' · '}
        <b dir="ltr">Daniela Marini</b> – <span dir="ltr">Español</span>
        {' · '}
        <b dir="ltr">David Katzin</b> – <span dir="rtl">עִברִית</span>
        {' · '}
        <b dir="ltr">Ethan Welty</b> – <span dir="ltr">Français</span>,{' '}
        <span dir="ltr">Español</span>
        {' · '}
        <b dir="ltr">Heimen Stoffels</b> – <span dir="ltr">Nederlands</span>
        {' · '}
        <b dir="ltr">Jadalnia Warszawa</b> – <span dir="ltr">Polski</span>
        {' · '}
        <b dir="ltr">Karolina Hansen</b> – <span dir="ltr">Polski</span>
        {' · '}
        <b dir="ltr">Kira Dell</b> – <span dir="ltr">Português</span>,{' '}
        <span dir="ltr">Español</span>
        {' · '}
        <b dir="ltr">Laura Clabé</b> – <span dir="ltr">Français</span>
        {' · '}
        <b dir="ltr">Liana Welty</b> – <span dir="ltr">Español</span>
        {' · '}
        <b dir="ltr">Lola Ortiz</b> – <span dir="ltr">Español</span>
        {' · '}
        <b dir="ltr">Maria Noel Silvera</b> – <span dir="ltr">Español</span>
        {' · '}
        <b dir="ltr">Maria Rosa Puig</b> – <span dir="ltr">Español</span>
        {' · '}
        <b dir="ltr">Michela Pasquali</b> – <span dir="ltr">Italiano</span>
        {' · '}
        <b dir="ltr">Monica Breval Listán</b> – <span dir="ltr">Español</span>
        {' · '}
        <b dir="ltr">Mylène Jacquemart</b> – <span dir="ltr">Deutsch</span>,{' '}
        <span dir="ltr">Italiano</span>
        {' · '}
        <b dir="ltr">Parmenter Welty</b> – <span dir="ltr">Español</span>
        {' · '}
        <b dir="ltr">Raven Lyn</b> – <span dir="ltr">Português</span>
        {' · '}
        <b dir="ltr">Salomé Martin</b> – <span dir="ltr">Français</span>
        {' · '}
        <b dir="ltr">Sifis Diamantidis</b> – <span dir="ltr">Ελληνικά</span>
        {' · '}
        <b dir="ltr">Thomaz Brandão Teixeira</b> –{' '}
        <span dir="ltr">Português</span>
        {' · '}
        <b dir="ltr">Tim Conze</b> – <span dir="ltr">Svenska</span>
        {' · '}
        <b dir="ltr">Timna Raz</b> – <span dir="rtl">עִברִית</span>
        {' · '}
        <b dir="ltr">Tống Thái Vương</b> – <span dir="ltr">Tiếng Việt</span>
      </p>

      <h2>{t('pages.about.closing_remarks')}</h2>
      <p>{renderHTML(t('pages.about.closing_remarks_para1_html'))}</p>
      <blockquote dir="ltr">
        Falling Fruit
        <br />
        535 S 44th St, Boulder, CO 80305, USA
        <br />
        EIN: 46-5363428
      </blockquote>
      <p>{renderHTML(t('pages.about.closing_remarks_para2_html'))}</p>
      <p>{renderHTML(t('pages.about.closing_remarks_para3_html'))}</p>
    </InfoPage>
  )
}

export default Project
