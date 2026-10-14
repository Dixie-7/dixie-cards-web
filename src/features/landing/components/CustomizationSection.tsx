import {
  ArrowsUpDownIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  PhotoIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import type { LandingContent } from '../landing.types';
import { Reveal, SectionHeading } from './LandingPrimitives';

export function CustomizationSection({
  content,
}: {
  content: LandingContent['customization'];
}) {
  return (
    <section id="customization" className="landing-section customization-section">
      <div className="landing-container customization-layout">
        <Reveal className="customization-copy">
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
          <ul className="customization-list">
            {content.bullets.map((bullet) => (
              <li key={bullet}>
                <span>
                  <CheckIcon />
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="customization-demo" delay={0.12}>
          <div className="editor-panel">
            <div className="editor-panel__header">
              <div>
                <span className="demo-kicker">DIXIE / EDIT</span>
                <strong>{content.panelLabel}</strong>
              </div>
              <span className="saved-chip">
                <i /> {content.liveLabel}
              </span>
            </div>

            <div className="editor-sections">
              {content.sections.map((section, index) => (
                <div
                  key={section.label}
                  className={`editor-section-row ${
                    section.enabled ? '' : 'is-disabled'
                  }`}
                >
                  <ArrowsUpDownIcon />
                  <span className="editor-section-row__number">0{index + 1}</span>
                  <strong>{section.label}</strong>
                  <span className={`editor-toggle ${section.enabled ? 'is-on' : ''}`}>
                    {section.enabled ? <EyeIcon /> : <EyeSlashIcon />}
                  </span>
                </div>
              ))}
            </div>

            <div className="editor-add-button" aria-hidden="true">
              <PlusIcon /> {content.addBlock}
            </div>
          </div>

          <div className="custom-card-preview">
            <div className="custom-card-preview__visual">
              <PhotoIcon />
              <span />
            </div>
            <div>
              <span className="demo-kicker">CUSTOM CARD</span>
              <strong>{content.cardTitle}</strong>
              <p>{content.cardDescription}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
