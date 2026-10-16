import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  CheckIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { motion, useReducedMotion } from 'motion/react';
import {
  landingDemoCards,
  landingDemoMainCard,
  landingDemoProject,
  landingDemoSkills,
} from '../landingDemoData';
import type { LandingContent } from '../landing.types';

interface HeroSectionProps {
  content: LandingContent['hero'];
  onCreate: () => void;
}

function HeroPortfolioMockup({ content }: { content: LandingContent['hero'] }) {
  const shouldReduceMotion = useReducedMotion();
  const presentationBlock = landingDemoMainCard.blocks[0];
  const technologies = landingDemoProject.technologies
    .split(';')
    .map((technology) => technology.trim())
    .slice(0, 3);

  return (
    <motion.div
      className="hero-portfolio-wrap"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 34, rotate: 1.2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.85, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit--two" aria-hidden="true" />

      <div className="hero-portfolio">
        <div className="hero-portfolio__bar">
          <div className="window-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span>{content.canvasLabel}</span>
          <div className="hero-portfolio__live">
            <i /> Live
          </div>
        </div>

        <div className="hero-portfolio__body">
          <div className="hero-profile-card">
            <div className="hero-profile-card__top">
              <div className="demo-avatar">SR</div>
              <span className="status-chip">
                <i /> {content.available}
              </span>
            </div>
            <div>
              <span className="demo-kicker">MAIN CARD / 3 BLOCKS</span>
              <h3>{presentationBlock.title}</h3>
              <p>{presentationBlock.content}</p>
            </div>
            <div className="hero-profile-card__footer">
              <span>FEATURE · 100%</span>
              <ArrowUpRightIcon />
            </div>
          </div>

          <div className="hero-portfolio__side">
            <div className="demo-project-card">
              <div className="demo-project-card__visual">
                <span className="demo-project-card__shape demo-project-card__shape--one" />
                <span className="demo-project-card__shape demo-project-card__shape--two" />
                <span className="demo-project-card__shape demo-project-card__shape--three" />
              </div>
              <span className="demo-kicker">
                {content.projectLabel} / {landingDemoProject.status}
              </span>
              <strong>{landingDemoProject.name}</strong>
              <div className="demo-project-card__technologies">
                {technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </div>

            <div className="demo-mini-grid">
              <div className="demo-skills-card">
                <span className="demo-kicker">{content.skillsLabel}</span>
                <div>
                  {landingDemoSkills.slice(0, 3).map((skill) => (
                    <span key={skill.id}>{skill.skillName}</span>
                  ))}
                </div>
              </div>
              <div className="demo-contact-card">
                <EnvelopeIcon />
                <span>{content.contactLabel} / USER CONTACT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="hero-floating-card hero-floating-card--left"
        animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="hero-floating-card__icon">
          <CheckIcon />
        </span>
        <span>
          <small>MAIN CARD</small>
          {landingDemoMainCard.blocks.length} content blocks
        </span>
      </motion.div>

      <motion.div
        className="hero-floating-card hero-floating-card--right"
        animate={shouldReduceMotion ? undefined : { y: [0, 7, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span>{landingDemoCards.length}</span>
        <small>USER CARDS</small>
      </motion.div>
    </motion.div>
  );
}

export function HeroSection({ content, onCreate }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="top" className="landing-hero">
      <div className="landing-hero__glow" aria-hidden="true" />
      <div className="landing-container landing-hero__grid">
        <motion.div
          className="landing-hero__copy"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="landing-eyebrow">
            <i /> {content.eyebrow}
          </span>
          <h1>
            {content.title}{' '}
            <span className="landing-gradient-text">{content.highlight}</span>
          </h1>
          <p>{content.description}</p>
          <div className="landing-hero__actions">
            <button
              type="button"
              className="landing-button landing-button--primary"
              onClick={onCreate}
            >
              {content.primaryCta}
              <ArrowUpRightIcon />
            </button>
            <a className="landing-button landing-button--ghost" href="#process">
              {content.secondaryCta}
              <ArrowDownIcon />
            </a>
          </div>
          <span className="landing-hero__note">
            <CheckIcon /> {content.reassurance}
          </span>
        </motion.div>

        <HeroPortfolioMockup content={content} />
      </div>

      <div className="landing-container landing-hero__ticker" aria-hidden="true">
        <span>PROJECTS</span>
        <i />
        <span>SKILLS</span>
        <i />
        <span>LANGUAGES</span>
        <i />
        <span>CV</span>
        <i />
        <span>YOUR STORY</span>
      </div>
    </section>
  );
}
