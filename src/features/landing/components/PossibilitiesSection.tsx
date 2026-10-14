import {
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import type { ComponentType, CSSProperties, SVGProps } from 'react';
import type { LandingContent } from '../landing.types';
import { Reveal, SectionHeading } from './LandingPrimitives';

const icons: Array<ComponentType<SVGProps<SVGSVGElement>>> = [
  FolderOpenIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  Squares2X2Icon,
  BriefcaseIcon,
  DocumentTextIcon,
];

export function PossibilitiesSection({
  content,
}: {
  content: LandingContent['possibilities'];
}) {
  return (
    <section id="possibilities" className="landing-section possibilities-section">
      <div className="landing-container">
        <Reveal>
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </Reveal>

        <div className="possibilities-grid">
          {content.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal
                key={item.title}
                delay={(index % 3) * 0.07}
                className={`possibility-card possibility-card--${index + 1}`}
              >
                <article>
                  <div className="possibility-card__top">
                    <span>{item.detail}</span>
                    <Icon aria-hidden="true" />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  {index === 0 && (
                    <div className="possibility-project-visual" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                  {index === 1 && (
                    <div className="possibility-skills" aria-hidden="true">
                      <span>UI Design</span>
                      <span>React</span>
                      <span>Strategy</span>
                      <span>Motion</span>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="possibility-languages" aria-hidden="true">
                      <span style={{ '--value': '100%' } as CSSProperties} />
                      <span style={{ '--value': '82%' } as CSSProperties} />
                      <span style={{ '--value': '54%' } as CSSProperties} />
                    </div>
                  )}
                  {index === 5 && (
                    <div className="possibility-document" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
