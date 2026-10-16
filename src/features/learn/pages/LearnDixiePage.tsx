import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CheckIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import { landingParticlesConfig } from '@/features/landing/landingParticlesConfig';
import ParticlesBackground from '@/shared/components/Background/ParticlesBackground';
import { learnVideos, type LearnVideo } from '../learnVideos';
import '../styles/learn.css';

function VideoStage({ video }: { video: LearnVideo }) {
  if (video.videoUrl) {
    return (
      <ReactPlayer
        src={video.videoUrl}
        controls
        width="100%"
        height="100%"
        playsInline
      />
    );
  }

  return (
    <div className="learn-video-placeholder">
      <span className="learn-video-placeholder__rings" aria-hidden="true" />
      <span className="learn-video-placeholder__play">
        <PlayIcon />
      </span>
      <div>
        <strong>Video próximamente</strong>
        <span>Este espacio ya está preparado para recibir la URL.</span>
      </div>
    </div>
  );
}

function LearnDixiePage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Learn Dixie Cards | Dixie Cards';
    document.documentElement.lang = 'es';
    window.scrollTo({ top: 0, behavior: 'auto' });

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="learn-page">
      <ParticlesBackground
        id="learn-dixie-particles"
        className="learn-page__particles"
        config={landingParticlesConfig}
      />

      <div className="learn-page__content">
        <header className="learn-header learn-container">
          <Link className="learn-brand" to="/" aria-label="Dixie Cards, inicio">
            <span>DC</span>
            <strong>DIXIE CARDS</strong>
          </Link>
          <Link className="learn-back-link" to="/">
            <ArrowLeftIcon /> Volver a la landing
          </Link>
        </header>

        <section className="learn-hero learn-container">
          <div className="learn-hero__copy">
            <span className="learn-kicker">DIXIE / LEARN</span>
            <h1>
              Entendé el producto. <span>Conocé la historia.</span>
            </h1>
            <p>
              Dos videos para aprender a construir tu portfolio y descubrir qué hay
              detrás de Dixie Cards.
            </p>
          </div>
          <nav className="learn-hero__index" aria-label="Contenido de la página">
            {learnVideos.map((video) => (
              <a key={video.id} href={`#${video.id}`}>
                <span>{video.index}</span>
                <strong>{video.duration}</strong>
                <ArrowUpRightIcon />
              </a>
            ))}
          </nav>
        </section>

        <section className="learn-videos learn-container" aria-label="Videos sobre Dixie Cards">
          {learnVideos.map((video) => (
            <article className="learn-video" id={video.id} key={video.id}>
              <div className="learn-video__stage">
                <VideoStage video={video} />
              </div>
              <div className="learn-video__copy">
                <span className="learn-video__number">{video.index}</span>
                <span className="learn-kicker">{video.eyebrow}</span>
                <h2>{video.title}</h2>
                <p>{video.description}</p>
                <ul>
                  {video.highlights.map((highlight) => (
                    <li key={highlight}>
                      <CheckIcon /> {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="learn-next-step learn-container">
          <span className="learn-kicker">CUANDO ESTÉS LISTO</span>
          <h2>Ahora hacelo tuyo.</h2>
          <p>Volvé a la landing y empezá a construir tu portfolio.</p>
          <Link className="learn-primary-link" to="/">
            Ir a Dixie Cards <ArrowUpRightIcon />
          </Link>
        </section>

        <footer className="learn-footer learn-container">
          <strong>DIXIE CARDS</strong>
          <span>Learn / Build / Share</span>
        </footer>
      </div>
    </main>
  );
}

export default LearnDixiePage;
