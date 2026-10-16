import {
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import { landingDemoCards } from '../landingDemoData';
import type { LandingContent } from '../landing.types';
import { Reveal, SectionHeading } from './LandingPrimitives';

export function CustomizationSection({
  content,
}: {
  content: LandingContent['customization'];
}) {
  const exampleCard = landingDemoCards[0];
  const listItems = (exampleCard.blocks[1]?.content ?? '')
    .split(';')
    .map((item) => item.trim());

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
                <span className="demo-kicker">USER CARD / EDIT</span>
                <strong>{content.panelLabel}</strong>
              </div>
              <span className="saved-chip">
                <i /> {content.liveLabel}
              </span>
            </div>

            <div className="editor-card-settings" aria-label="Configuración de ejemplo">
              <span>
                <small>TEMPLATE</small>
                {exampleCard.template}
              </span>
              <span>
                <small>WIDTH</small>
                {exampleCard.width}%
              </span>
              <span>
                <small>ORDER</small>
                0{exampleCard.sortOrder}
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
                  <span className="editor-section-row__number">0{index + 1}</span>
                  <strong>{section.label}</strong>
                  <span className={`editor-toggle ${section.enabled ? 'is-on' : ''}`}>
                    {section.enabled ? <EyeIcon /> : <EyeSlashIcon />}
                  </span>
                </div>
              ))}
            </div>

            <div className="editor-blocks">
              {exampleCard.blocks.map((block, index) => (
                <div key={block.id}>
                  <RectangleGroupIcon />
                  <span>
                    <small>BLOCK 0{index + 1}</small>
                    {block.type} · {block.template}
                  </span>
                  <b>{block.width}%</b>
                </div>
              ))}
            </div>

            <div className="editor-add-button" aria-hidden="true">
              <PlusIcon /> {content.addBlock}
            </div>
          </div>

          <div className="custom-card-preview">
            <span className="custom-card-preview__meta">
              {exampleCard.template} · {exampleCard.width}%
            </span>
            <div>
              <span className="demo-kicker">USER CARD</span>
              <strong>{exampleCard.title}</strong>
              <p>{exampleCard.description}</p>
              <div className="custom-card-preview__chips">
                {listItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
