import {
  ArrowDownTrayIcon,
  ArrowUpRightIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import {
  landingDemoCards,
  landingDemoContact,
  landingDemoCv,
  landingDemoLanguages,
  landingDemoMainCard,
  landingDemoProject,
  landingDemoSkills,
} from '../landingDemoData';
import type { LandingContent } from '../landing.types';
import { Reveal, SectionHeading } from './LandingPrimitives';

export function PortfolioPreviewSection({
  content,
}: {
  content: LandingContent['preview'];
}) {
  const mainPresentation = landingDemoMainCard.blocks[0];
  const mainStack = (landingDemoMainCard.blocks[1]?.content ?? '')
    .split(';')
    .map((item) => item.trim());
  const mainPhoto = landingDemoMainCard.blocks[2];
  const technologies = landingDemoProject.technologies
    .split(';')
    .map((technology) => technology.trim());

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

          <div className="portfolio-browser__page real-portfolio-preview">
            <nav className="real-preview-nav" aria-label="Portfolio de ejemplo">
              <strong>DIXIE / SOFIA RIOS</strong>
              <div>
                <span>01 {content.projectsLabel}</span>
                <span>02 {content.skillsLabel}</span>
                <span>03 {content.contactLabel}</span>
              </div>
            </nav>

            <article className="real-main-card">
              <div className="real-main-card__intro">
                <span className="demo-kicker">MAIN CARD / TEXT BLOCK</span>
                <h3>{mainPresentation.title}</h3>
                <p>{mainPresentation.content}</p>
                <div className="real-main-card__stack">
                  {mainStack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <div className="real-main-card__photo">
                <img
                  src={mainPhoto.mediaUrl ?? undefined}
                  alt={mainPhoto.caption ?? 'Portfolio workspace'}
                  loading="lazy"
                />
                <span>{mainPhoto.caption}</span>
              </div>
            </article>

            <div className="real-preview-section-heading">
              <span>01 / PROJECT</span>
              <strong>{content.projectsLabel}</strong>
            </div>

            <article className="real-project-card">
              <div className="real-project-card__image">
                <img
                  src={landingDemoProject.images[0]?.imageUrl}
                  alt={landingDemoProject.images[0]?.altText ?? landingDemoProject.name}
                  loading="lazy"
                />
                <span>{landingDemoProject.status}</span>
              </div>
              <div className="real-project-card__copy">
                <span className="demo-kicker">PROJECT / 2026</span>
                <h4>{landingDemoProject.name}</h4>
                <p>{landingDemoProject.description}</p>
                <div className="real-project-card__technologies">
                  {technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
                <small>Collaborators: {landingDemoProject.collaborators}</small>
              </div>
            </article>

            <div className="real-user-card-grid">
              {landingDemoCards.map((card, cardIndex) => (
                <article key={card.id} className={`real-user-card real-user-card--${card.template}`}>
                  <div className="real-user-card__meta">
                    <span>0{cardIndex + 1} / USER CARD</span>
                    <span>{card.template} · {card.width}%</span>
                  </div>
                  <h4>{card.title}</h4>
                  <p>{card.description}</p>
                  <div className="real-user-card__blocks">
                    {card.blocks.map((block) => (
                      <span key={block.id}>{block.template}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="real-preview-details">
              <article className="real-skills-card">
                <span className="demo-kicker">02 / {content.skillsLabel}</span>
                <div>
                  {landingDemoSkills.map((skill) => (
                    <span key={skill.id}>
                      <i style={{ backgroundColor: skill.skillColor ?? '#9b87f5' }} />
                      {skill.skillName}
                      <small>{skill.skillNote}</small>
                    </span>
                  ))}
                </div>
              </article>

              <article className="real-languages-card">
                <span className="demo-kicker">03 / {content.languagesLabel}</span>
                {landingDemoLanguages.map((language) => (
                  <div key={language.id}>
                    <span>{language.language}</span>
                    <strong>{language.level} · {language.skillPercent}%</strong>
                  </div>
                ))}
              </article>

              <article className="real-contact-card">
                <EnvelopeIcon />
                <span>{landingDemoContact.publicEmail}</span>
                <strong>@{landingDemoContact.gitHub}</strong>
                <div>
                  <ArrowDownTrayIcon /> {landingDemoCv.name}
                </div>
                <ArrowUpRightIcon className="real-contact-card__arrow" />
              </article>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
