import {
  ArrowLongRightIcon,
  LinkIcon,
  PencilSquareIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';
import type { LandingContent } from '../landing.types';
import { Reveal, SectionHeading } from './LandingPrimitives';

const stepIcons: Array<ComponentType<SVGProps<SVGSVGElement>>> = [
  UserPlusIcon,
  PencilSquareIcon,
  LinkIcon,
];

export function HowItWorksSection({
  content,
}: {
  content: LandingContent['process'];
}) {
  return (
    <section id="process" className="landing-section process-section">
      <div className="landing-container">
        <Reveal>
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
            align="center"
          />
        </Reveal>

        <div className="process-grid">
          {content.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <Reveal key={step.number} className="process-step" delay={index * 0.1}>
                <article>
                  <div className="process-step__top">
                    <span>{step.number}</span>
                    <div>
                      <Icon />
                    </div>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
                {index < content.steps.length - 1 && (
                  <ArrowLongRightIcon className="process-step__arrow" aria-hidden="true" />
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
