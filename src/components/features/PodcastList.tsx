import PodcastEpisodeCard, { PodcastEpisode } from './PodcastEpisodeCard';

interface PodcastListProps {
  episodes: PodcastEpisode[];
}

const PodcastList = ({ episodes }: PodcastListProps) => {
  return (
    <div className="space-y-6">
      {episodes.map((episode) => (
        <PodcastEpisodeCard key={episode.id} episode={episode} />
      ))}
    </div>
  );
};

export default PodcastList;
