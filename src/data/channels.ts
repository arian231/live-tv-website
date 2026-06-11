export type Channel = {
  id: string;
  name: string;
  cat: string;
  url: string;
  logo: string;
};

export const defaultChannels: Channel[] = [
  { id: '12305', name: 'Caze Tv Brasil', cat: 'FIFA World Cup', url: 'https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/1080p-vtt/index.m3u8', logo: 'https://placehold.co/100x100/111827/00ffff?text=Caze' },
  { id: '12307', name: 'Bein Sports XTRA', cat: 'FIFA World Cup', url: 'https://amg01334-amg01334c2-freelivesports-emea-6791.playouts.now.amagi.tv/playlist/amg01334-beinxtra-beinxtrausapp-freelivesportsemea/playlist.m3u8', logo: 'https://placehold.co/100x100/111827/00ffff?text=Bein' },
  { id: '12318', name: 'FIFA Plus Argentina', cat: 'Sports', url: 'https://6c849fb3.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/TEctbXhfRklGQVBsdXNTcGFuaXNoLTFfSExT/playlist.m3u8', logo: 'https://placehold.co/100x100/111827/00ffff?text=FIFA' },
  { id: '12312', name: 'Somoy Tv', cat: 'Bangladesh', url: 'https://sm-monirul.top/toffee/play/somoy_tv.m3u8', logo: 'https://placehold.co/100x100/111827/00ffff?text=Somoy' },
  { id: '12314', name: 'T Sports HD', cat: 'Bangladesh', url: 'https://tvsen7.aynaott.com/tsports-hd/index.m3u8', logo: 'https://placehold.co/100x100/111827/00ffff?text=TSports' },
  { id: '12408', name: 'Cartoon Network', cat: 'Cartoon', url: 'https://tvsen5.aynaott.com/cartoonnetwork/tracks-v1a1/mono.ts.m3u8', logo: 'https://placehold.co/100x100/111827/00ffff?text=CN' },
  { id: '12410', name: 'Duronto Live', cat: 'Cartoon', url: 'https://tvsen6.aynaott.com/durontotv-live/index.m3u8', logo: 'https://placehold.co/100x100/111827/00ffff?text=Duronto' },
  { id: '12384', name: 'Jalsha Movies', cat: 'Movies', url: 'http://198.195.239.50:8095/JalshaMovies/tracks-v1a1/mono.m3u8', logo: 'https://placehold.co/100x100/111827/00ffff?text=Jalsha' },
  { id: '12392', name: '9X Tashan', cat: 'Music', url: 'https://wiselp.wiseplayout.com/9X_Tashan/master.m3u8', logo: 'https://placehold.co/100x100/111827/00ffff?text=9X' },
  { id: '12434', name: 'Jamuna TV', cat: 'News', url: 'https://tvsen6.aynaott.com/jamunatv/index.m3u8', logo: 'https://placehold.co/100x100/111827/00ffff?text=Jamuna' },
  { id: '12452', name: 'BBC Earth', cat: 'Documentary', url: 'https://amg00793-amg00793c6-xumo-us-2669.playouts.now.amagi.tv/BBCStudios-BBCEarthA-hls/playlist540p.m3u8', logo: 'https://placehold.co/100x100/111827/00ffff?text=BBCEarth' },
  { id: '12454', name: 'Animal Planet', cat: 'Documentary', url: 'https://tiger-hub.vercel.app@vodzong.mjunoon.tv:8087/streamtest/Animal-Planet-158-3/playlist.m3u8', logo: 'https://placehold.co/100x100/111827/00ffff?text=Animal' }
];

export const CATEGORIES = ['All', 'Bangladesh', 'FIFA World Cup', 'Sports', 'Movies', 'Music', 'Cartoon', 'News', 'Documentary'];
