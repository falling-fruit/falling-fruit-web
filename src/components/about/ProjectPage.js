import { useTranslation } from 'react-i18next'
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

const Project = () => {
  const { t } = useTranslation()

  // Function to safely render HTML content
  const renderHTML = (html) => (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  )

  return (
    <PageScrollWrapper>
      <PageTemplate from="Settings">
        <div className="grid">
          <PhotoGridTemplate photos={foragingPhotos} float={'right'} />
          <p>
            <em>{renderHTML(t('pages.about.ff_disclaimer_html'))}</em>
          </p>
          <h3>{t('glossary.donate')}</h3>
          <p>
            <em>{t('pages.about.give_us_money')}</em>
            <br />
            <br />
            <form action="https://www.paypal.com/us/fundraiser/charity/1387793">
              <PointerButton type="submit">
                {t('pages.about.give_paypal')}
              </PointerButton>
            </form>
          </p>
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
          <img src="https://fallingfruit.org/ethan_welty.jpg" alt="" />
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
          <img src="https://fallingfruit.org/jeff_wanner.jpg" alt="" />
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
          <img src="https://fallingfruit.org/craig_durkin.jpg" alt="" />
          <p>
            <b>Craig Durkin</b>
            <br />
            Atlanta, Georgia, USA
            <br />
            <br />
            {renderHTML(t('pages.about.craig_durkin_bio_html'))}
          </p>
        </div>
        <div className="content">
          <img src="https://fallingfruit.org/emily_sigman.jpg" alt="" />
          <p>
            <b>Emily Sigman</b>
            <br />
            New Haven, Connecticut, USA
            <br />
            <br />
            {renderHTML(t('pages.about.emily_sigman_bio_html'))}
          </p>
        </div>
        <h2>{t('pages.about.advisors')}</h2>
        <div className="content">
          <img src="https://fallingfruit.org/alan_gibson.jpg" alt="" />
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
          <img src="https://fallingfruit.org/ana_carolina_de_lima.jpg" alt="" />
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
          <img src="https://fallingfruit.org/caleb_phillips.jpg" alt="" />
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
          <img src="https://fallingfruit.org/cristina_rubke.jpg" alt="" />
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
          <img src="https://fallingfruit.org/david_craft.jpg" alt="" />
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
          <img src="https://fallingfruit.org/tristram_stuart.jpg" alt="" />
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
          <b dir="ltr">Tống Thái Vương</b> - Tiếng Việt
          <br />
        </p>

        <h2>{t('pages.about.closing_remarks')}</h2>
        <p>{renderHTML(t('pages.about.closing_remarks_para1_html'))}</p>
        <blockquote>
          Falling Fruit
          <br />
          535 S 44th St, Boulder, CO 80305, USA
          <br />
          EIN: 46-5363428
        </blockquote>
        <p>{renderHTML(t('pages.about.closing_remarks_para2_html'))}</p>
        <p>{renderHTML(t('pages.about.closing_remarks_para3_html'))}</p>
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default Project
