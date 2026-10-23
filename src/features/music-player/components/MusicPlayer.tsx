import { useEffect, useRef, useState } from 'react';
import type { FormEvent, SyntheticEvent } from 'react';
import {
  CheckIcon,
  LinkIcon,
  PauseIcon,
  PlayIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ReactPlayer from 'react-player';
import { getMusicPlayerSource } from '@/features/music-player/api/musicPlayerApi';
import type { MusicPlayerSource } from '@/features/music-player/types/musicPlayer.types';
import { useLanguage } from '@/shared/i18n/useLanguage';
import './MusicPlayer.css';

const initialSource: MusicPlayerSource = {
  title: '',
  url: '',
};

interface MusicPlayerProps {
  allowSourceEditing?: boolean;
  sourceTitle?: string;
  sourceUrl?: string | null;
  startPlaying?: boolean;
}

function MusicPlayer({
  allowSourceEditing = true,
  sourceTitle,
  sourceUrl,
  startPlaying = true,
}: MusicPlayerProps) {
  const { t } = useLanguage();
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [source, setSource] = useState<MusicPlayerSource>(initialSource);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [draftUrl, setDraftUrl] = useState(initialSource.url);
  const [isPlaying, setIsPlaying] = useState(startPlaying);
  const [volume, setVolume] = useState(0.15);
  const [isMuted, setIsMuted] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadSource() {
      if (sourceUrl !== undefined) {
        const nextUrl = sourceUrl?.trim() ?? '';

        if (isMounted) {
          setSource({
            title: sourceTitle ?? getManualSourceTitle(nextUrl, t('musicManual')),
            url: nextUrl,
          });
          setDraftUrl(nextUrl);
          setIsPlaying(startPlaying);
          setPlayedSeconds(0);
          setDurationSeconds(0);
        }

        return;
      }

      const nextSource = await getMusicPlayerSource();

      if (isMounted) {
        setSource(nextSource);
        setDraftUrl(nextSource.url);
        setIsPlaying(startPlaying);
        setPlayedSeconds(0);
        setDurationSeconds(0);
      }
    }

    loadSource();

    return () => {
      isMounted = false;
    };
  }, [sourceTitle, sourceUrl, startPlaying, t]);

  if (!source.url) {
    return null;
  }

  function handleOpenUrlEditor() {
    setDraftUrl(source.url);
    setIsEditingUrl(true);
  }

  function handleCancelUrlEditor() {
    setDraftUrl(source.url);
    setIsEditingUrl(false);
  }

  function handleSubmitUrl(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextUrl = draftUrl.trim();

    if (!nextUrl) {
      return;
    }

    setSource({
      title: getManualSourceTitle(nextUrl, t('musicManual')),
      url: nextUrl,
    });
    setIsPlaying(true);
    setPlayedSeconds(0);
    setDurationSeconds(0);
    setDraftUrl(nextUrl);
    setIsEditingUrl(false);
  }

  function handleSeek(nextValue: string) {
    const nextTime = Number(nextValue);

    if (!Number.isFinite(nextTime)) {
      return;
    }

    setPlayedSeconds(nextTime);

    if (playerRef.current) {
      playerRef.current.currentTime = nextTime;
    }
  }

  function handleTimeUpdate(event: SyntheticEvent<HTMLVideoElement>) {
    const mediaElement = event.currentTarget;

    setPlayedSeconds(mediaElement.currentTime);

    if (Number.isFinite(mediaElement.duration)) {
      setDurationSeconds(mediaElement.duration);
    }
  }

  function handleDurationChange(event: SyntheticEvent<HTMLVideoElement>) {
    const nextDuration = event.currentTarget.duration;
    setDurationSeconds(Number.isFinite(nextDuration) ? nextDuration : 0);
  }

  function handleToggleMute() {
    setIsMuted(true);
  }

  function handleVolumeChange(nextValue: string) {
    const nextVolume = Number(nextValue);

    if (!Number.isFinite(nextVolume)) {
      return;
    }

    setVolume(nextVolume);
    setIsMuted(false);
  }

  const safePlayedSeconds = durationSeconds
    ? Math.min(playedSeconds, durationSeconds)
    : 0;
  const displayedVolume = isMuted ? 0 : volume;

  return (
    <aside className="music-player" aria-label={t('musicPlayer')}>
      <div className="music-player__header">
        <span className="music-player__label">{source.title}</span>
        {allowSourceEditing && (
          <button
            type="button"
            className="music-player__icon-button"
            aria-label={t('musicChangeSource')}
            title={t('musicChangeSource')}
            onClick={handleOpenUrlEditor}
          >
            <LinkIcon aria-hidden="true" />
          </button>
        )}
      </div>

      {allowSourceEditing && isEditingUrl && (
        <form className="music-player__form" onSubmit={handleSubmitUrl}>
          <input
            className="music-player__input"
            type="url"
            value={draftUrl}
            aria-label={t('musicSourceUrl')}
            placeholder="https://..."
            required
            onChange={(event) => setDraftUrl(event.target.value)}
          />
          <button
            type="submit"
            className="music-player__icon-button music-player__icon-button--confirm"
            aria-label={t('musicPlayUrl')}
            title={t('musicPlayUrl')}
          >
            <CheckIcon aria-hidden="true" />
          </button>
          <button
            type="button"
            className="music-player__icon-button"
            aria-label={t('musicCancelUrl')}
            title={t('actionCancel')}
            onClick={handleCancelUrlEditor}
          >
            <XMarkIcon aria-hidden="true" />
          </button>
        </form>
      )}

      <div className="music-player__controls">
        <div className="music-player__playback-row">
          <button
            type="button"
            className="music-player__icon-button"
            aria-label={isPlaying ? t('musicPause') : t('musicPlay')}
            title={isPlaying ? t('musicPause') : t('musicPlay')}
            onClick={() => setIsPlaying((currentValue) => !currentValue)}
          >
            {isPlaying ? (
              <PauseIcon aria-hidden="true" />
            ) : (
              <PlayIcon aria-hidden="true" />
            )}
          </button>
          <div className="music-player__volume-popover">
            <button
              type="button"
              className="music-player__icon-button"
              aria-label={t('musicMute')}
              title={t('musicMute')}
              onClick={handleToggleMute}
            >
              {isMuted || volume === 0 ? (
                <SpeakerXMarkIcon aria-hidden="true" />
              ) : (
                <SpeakerWaveIcon aria-hidden="true" />
              )}
            </button>
            <div className="music-player__volume-panel">
              <input
                className="music-player__range music-player__range--volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={displayedVolume}
                aria-label={t('musicVolume')}
                style={{
                  background: getVolumeRangeBackground(displayedVolume),
                }}
                onChange={(event) => handleVolumeChange(event.target.value)}
              />
            </div>
          </div>
          <input
            className="music-player__range"
            type="range"
            min="0"
            max={durationSeconds || 0}
            step="1"
            value={safePlayedSeconds}
            aria-label={t('musicSeek')}
            disabled={!durationSeconds}
            onChange={(event) => handleSeek(event.target.value)}
          />
          <span className="music-player__time">
            {formatPlayerTime(safePlayedSeconds)} / {formatPlayerTime(durationSeconds)}
          </span>
        </div>
      </div>

      <div className="music-player__media music-player__media--hidden">
        <ReactPlayer
          ref={playerRef}
          key={source.url}
          src={source.url}
          playing={isPlaying}
          controls={false}
          volume={volume}
          muted={isMuted || volume === 0}
          width="100%"
          height="1px"
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
        />
      </div>
    </aside>
  );
}

function getManualSourceTitle(url: string, fallbackTitle = 'Manual playback') {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '') || fallbackTitle;
  } catch {
    return fallbackTitle;
  }
}

function formatPlayerTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '0:00';
  }

  const roundedSeconds = Math.floor(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getVolumeRangeBackground(volume: number) {
  const volumePercent = Math.round(volume * 100);

  return `linear-gradient(to top, #67e8f9 0%, #67e8f9 ${volumePercent}%, transparent ${volumePercent}%, transparent 100%)`;
}

export default MusicPlayer;
