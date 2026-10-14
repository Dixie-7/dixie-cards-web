import {
  ArrowUpRightIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import type { LandingContent } from '../landing.types';
import { Reveal, SectionHeading } from './LandingPrimitives';

export function PortfolioPreviewSection({
  content,
}: {
  content: LandingContent['preview'];
}) {
  return (
    <section id="preview" className="landing-section preview-section">
      <div className="landing-container">
        <Reveal>
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </Reveal>

        <Reveal className="portfolio-browser" delay={0.1}>
          <div className="portfolio-browser__chrome">
            <div className="window-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="portfolio-browser__url">
              <GlobeAltIcon />
              <span>{content.browserLabel}</span>
            </div>
            <span className="portfolio-browser__menu">•••</span>
          </div>

          <div className="portfolio-browser__page">
            <aside className="preview-profile">
              <div className="preview-profile__avatar">AL</div>
              <div>
                <span className="demo-kicker">{content.profileRole}</span>
                <h3>Alex Luna</h3>
              </div>
              <p>{content.profileBio}</p>
              <div className="preview-profile__location">
                <MapPinIcon /> Buenos Aires, AR
              </div>
              <div className="preview-profile__socials" aria-hidden="true">
                <span>BE</span>
                <span>LI</span>
                <span>GH</span>
              </div>
            </aside>

            <div className="preview-content">
              <div className="preview-content__heading">
                <div>
                  <span className="demo-kicker">01 / WORK</span>
                  <h3>{content.projectsLabel}</h3>
                </div>
                <span>2024 — 2026</span>
              </div>

              <div className="preview-projects">
                <article className="preview-project preview-project--primary">
                  <div className="preview-project__art preview-project__art--orbital">
                    <span />
                    <span />
                    <i>O</i>
                  </div>
                  <div className="preview-project__copy">
                    <span>{content.featured}</span>
                    <div>
                      <h4>{content.projectOne}</h4>
                      <p>{content.projectOneType}</p>
                    </div>
                    <ArrowUpRightIcon />
                  </div>
                </article>

                <article className="preview-project preview-project--secondary">
                  <div className="preview-project__art preview-project__art--pausa">
                    <span>PAU</span>
                    <span>SA</span>
                  </div>
                  <div className="preview-project__copy">
                    <div>
                      <h4>{content.projectTwo}</h4>
                      <p>{content.projectTwoType}</p>
                    </div>
                    <ArrowUpRightIcon />
                  </div>
                </article>
              </div>

              <div className="preview-details">
                <article className="preview-skills">
                  <span className="demo-kicker">{content.skillsLabel}</span>
                  <div>
                    {['TypeScript', 'React', 'Figma', 'Motion', 'Research'].map(
                      (skill) => (
                        <span key={skill}>{skill}</span>
                      ),
                    )}
                  </div>
                </article>
                <article className="preview-languages">
                  <span className="demo-kicker">{content.languagesLabel}</span>
                  <p>{content.languageOne}</p>
                  <p>{content.languageTwo}</p>
                </article>
                <article className="preview-contact">
                  <EnvelopeIcon />
                  <span>{content.contactLabel}</span>
                  <strong>{content.contactCta}</strong>
                </article>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
