import type { AuthEntryMode, LandingContent } from '../landing.types';
import { BrandMark } from './LandingPrimitives';

export function LandingFooter({
  content,
  onOpenAuth,
}: {
  content: LandingContent['footer'];
  onOpenAuth: (mode: AuthEntryMode) => void;
}) {
  return (
    <footer className="landing-footer">
      <div className="landing-container landing-footer__grid">
        <div className="landing-footer__brand">
          <BrandMark />
          <p>{content.tagline}</p>
        </div>

        <div className="landing-footer__column">
          <strong>{content.product}</strong>
          <a href="#possibilities">{content.possibilities}</a>
          <a href="#process">{content.process}</a>
          <a href="#preview">{content.preview}</a>
        </div>

        <div className="landing-footer__column">
          <strong>{content.access}</strong>
          <button type="button" onClick={() => onOpenAuth('login')}>
            {content.login}
          </button>
          <button type="button" onClick={() => onOpenAuth('register')}>
            {content.create}
          </button>
        </div>
      </div>
      <div className="landing-container landing-footer__bottom">
        <span>© {new Date().getFullYear()} {content.copyright}</span>
        <span>BUENOS AIRES / DIGITAL EVERYWHERE</span>
      </div>
    </footer>
  );
}
