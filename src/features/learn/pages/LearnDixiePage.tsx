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
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import { useLanguage } from '@/shared/i18n/useLanguage';
import { englishLearnVideos, learnVideos, type LearnVideo } from '../learnVideos';
import '../styles/learn.css';

function VideoStage({ video, isSpanish }: { video: LearnVideo; isSpanish: boolean }) {
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
        <strong>{isSpanish ? 'Video proximamente' : 'Video coming soon'}</strong>
        <span>
          {isSpanish
            ? 'Este espacio ya esta preparado para recibir la URL.'
            : 'This space is ready for the video URL.'}
        </span>
      </div>
    </div>
  );
}

function LearnDixiePage() {
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const videos = isSpanish ? learnVideos : englishLearnVideos;
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Learn Dixie Cards | Dixie Cards';
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
          <Link className="learn-brand" to="/" aria-label={`Dixie Cards, ${isSpanish ? 'inicio' : 'home'}`}>
            <span>DC</span>
            <strong>DIXIE CARDS</strong>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link className="learn-back-link" to="/">
              <ArrowLeftIcon /> {isSpanish ? 'Volver a la landing' : 'Back to landing'}
            </Link>
          </div>
        </header>

        <section className="learn-hero learn-container">
          <div className="learn-hero__copy">
            <span className="learn-kicker">DIXIE / LEARN</span>
            <h1>
              {isSpanish ? 'Entende el producto. ' : 'Understand the product. '}
              <span>{isSpanish ? 'Conoce la historia.' : 'Discover the story.'}</span>
            </h1>
            <p>
              {isSpanish
                ? 'Dos videos para aprender a construir tu portfolio y descubrir que hay detras de Dixie Cards.'
                : 'Two videos to learn how to build your portfolio and discover the story behind Dixie Cards.'}
            </p>
          </div>
          <nav className="learn-hero__index" aria-label={isSpanish ? 'Contenido de la pagina' : 'Page contents'}>
            {videos.map((video) => (
              <a key={video.id} href={`#${video.id}`}>
                <span>{video.index}</span>
                <strong>{video.duration}</strong>
                <ArrowUpRightIcon />
              </a>
            ))}
          </nav>
        </section>

        <section className="learn-videos learn-container" aria-label={isSpanish ? 'Videos sobre Dixie Cards' : 'Videos about Dixie Cards'}>
          {videos.map((video) => (
            <article className="learn-video" id={video.id} key={video.id}>
              <div className="learn-video__stage">
                <VideoStage video={video} isSpanish={isSpanish} />
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
          <span className="learn-kicker">{isSpanish ? 'CUANDO ESTES LISTO' : 'WHEN YOU ARE READY'}</span>
          <h2>{isSpanish ? 'Ahora hacelo tuyo.' : 'Now make it yours.'}</h2>
          <p>{isSpanish ? 'Volve a la landing y empeza a construir tu portfolio.' : 'Return to the landing page and start building your portfolio.'}</p>
          <Link className="learn-primary-link" to="/">
            {isSpanish ? 'Ir a Dixie Cards' : 'Go to Dixie Cards'} <ArrowUpRightIcon />
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
