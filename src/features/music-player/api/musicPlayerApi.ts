import type { MusicPlayerSource } from '@/features/music-player/types/musicPlayer.types';

const fallbackMusicSource: MusicPlayerSource = {
  title: 'Dixie Radio',
  url:
    import.meta.env.VITE_MUSIC_PLAYER_URL ??
    'https://www.youtube.com/watch?v=stVlz3nKUtc&list=RDstVlz3nKUtc',
};

export async function getMusicPlayerSource(): Promise<MusicPlayerSource> {
  // Replace this with the external music endpoint when it is available.
  return fallbackMusicSource;
}
