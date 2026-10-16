import {
  ArrowUpRightIcon,
  CodeBracketSquareIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import type { LandingContent } from '../landing.types';
import { Reveal } from './LandingPrimitives';

interface LearnDixieSectionProps {
  content: LandingContent['learn'];
  onLearn: () => void;
}

export function LearnDixieSection({ content, onLearn }: LearnDixieSectionProps) {
  return (
    <section className="landing-section learn-dixie-section">
      <div className="landing-container">
        <Reveal className="learn-dixie-card">
          <div className="learn-dixie-card__copy">
            <span className="landing-eyebrow">
              <i /> {content.eyebrow}
            </span>
            <h2>{content.title}</h2>
            <p>{content.description}</p>
            <button
              type="button"
              className="landing-button landing-button--primary"
              onClick={onLearn}
            >
              {content.button}
              <ArrowUpRightIcon />
            </button>
          </div>

          <div className="learn-dixie-card__videos" aria-hidden="true">
            <article className="learn-video-tile learn-video-tile--tutorial">
              <span className="learn-video-tile__number">01</span>
              <span className="learn-video-tile__icon">
                <PlayIcon />
              </span>
              <div>
                <small>WATCH / LEARN</small>
                <strong>{content.tutorialLabel}</strong>
              </div>
            </article>
            <article className="learn-video-tile learn-video-tile--story">
              <span className="learn-video-tile__number">02</span>
              <span className="learn-video-tile__icon">
                <CodeBracketSquareIcon />
              </span>
              <div>
                <small>BEHIND / DIXIE</small>
                <strong>{content.storyLabel}</strong>
              </div>
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
