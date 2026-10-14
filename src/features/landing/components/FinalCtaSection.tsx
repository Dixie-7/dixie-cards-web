import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import type { LandingContent } from '../landing.types';
import { Reveal } from './LandingPrimitives';

export function FinalCtaSection({
  content,
  onCreate,
}: {
  content: LandingContent['finalCta'];
  onCreate: () => void;
}) {
  return (
    <section className="landing-section final-cta-section">
      <div className="landing-container">
        <Reveal className="final-cta">
          <div className="final-cta__grid" aria-hidden="true" />
          <span className="landing-eyebrow">{content.eyebrow}</span>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
          <button
            type="button"
            className="landing-button landing-button--light"
            onClick={onCreate}
          >
            {content.button}
            <ArrowUpRightIcon />
          </button>
          <span className="final-cta__note">{content.note}</span>
        </Reveal>
      </div>
    </section>
  );
}
