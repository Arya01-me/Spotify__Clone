import React, { useEffect, useState } from 'react';
import './Body.css';
import Header from './Header';
import { useDataLayerValue } from './DataLayer';

function Body({ spotify }) {
  const [{ selectedPlaylistId, token }, dispatch] = useDataLayerValue();
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [trendingContent, setTrendingContent] = useState([]);
  const [suggestedContent, setSuggestedContent] = useState([]);
  const [freshNewMusic, setFreshNewMusic] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [isPlaylistSelected, setIsPlaylistSelected] = useState(false);

  useEffect(() => {
    if (selectedPlaylistId) {
      setIsPlaylistSelected(true);
      spotify
        .getPlaylistTracks(selectedPlaylistId)
        .then((response) => {
          setPlaylistTracks(response.items);
        })
        .catch((error) => console.error('Error fetching playlist tracks:', error));
    } else {
      setIsPlaylistSelected(false);
      // Fetch trending content
      fetchTrendingContent();
      // Fetch suggested content
      fetchSuggestedContent();
      // Fetch fresh new music
      fetchFreshNewMusic();
      // Fetch top artists
      fetchTopArtists();
    }
  }, [selectedPlaylistId, spotify]);

  const fetchTrendingContent = () => {
    spotify
      .getNewReleases({ limit: 20 }) // Adjust limit based on your needs
      .then((response) => {
        setTrendingContent(response.albums.items);
      })
      .catch((error) => console.error('Error fetching trending content:', error));
  };

  const fetchSuggestedContent = () => {
    spotify
      .getFeaturedPlaylists({ limit: 20 }) // Adjust limit based on your needs
      .then((response) => {
        setSuggestedContent(response.playlists.items);
      })
      .catch((error) => console.error('Error fetching suggested content:', error));
  };

  const fetchFreshNewMusic = () => {
    spotify
      .getNewReleases({ limit: 20 }) // Adjust limit based on your needs
      .then((response) => {
        setFreshNewMusic(response.albums.items);
      })
      .catch((error) => console.error('Error fetching fresh new music:', error));
  };

  const fetchTopArtists = () => {
    spotify
      .getMyTopArtists({ time_range: 'medium_term', limit: 10 }) // Adjust time_range and limit based on your needs
      .then((response) => {
        setTopArtists(response.items);
      })
      .catch((error) => console.error('Error fetching top artists:', error));
  };

  const playTrack = (track) => {
    dispatch({
      type: 'SET_CURRENTLY_PLAYING',
      track: track.track,
    });

    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [track.track.uri] }),
    }).catch((error) => console.error('Error playing track:', error));
  };

  return (
    <div className='body'>
      <Header spotify={spotify} />

      <div className='body_info'>
        <img
          src='https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/39MO4rpxkctRc574LExDwQ=='
          alt=''
        />
        <div className='body_infoText'>
          <strong>PLAYLIST</strong>
          <h2>{isPlaylistSelected ? 'Selected Playlist' : 'TRENDING SONGS'}</h2>
          <p>{isPlaylistSelected ? 'Description' : 'Check out the latest trending and suggested tracks and albums'}</p>
        </div>
      </div>
      
      <div className='body_songs'>
        {isPlaylistSelected ? (
          <div className='body_playlist'>
            {playlistTracks.map((track) => (
              <div key={track.track.id} className='body_songRow' onClick={() => playTrack(track)}>
                <img src={track.track.album.images[0].url} alt={track.track.name} />
                <div className='body_songInfo'>
                  <h1>{track.track.name}</h1>
                  <p>{track.track.artists.map((artist) => artist.name).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className='body_trendingGrid'>
              {trendingContent.map((album) => (
                <div key={album.id} className='body_trending' onClick={() => playTrack({ track: { uri: album.uri } })}>
                  <img src={album.images[0].url} alt={album.name} />
                  <div className='body_trendingInfo'>
                    <h1>{album.name}</h1>
                    <p>{album.artists.map((artist) => artist.name).join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className='suggested_h2'>Suggested Songs & Albums</h2>
            <div className='body_suggested'>
              {suggestedContent.map((playlist) => (
                <div key={playlist.id} className='body_suggestedItem' onClick={() => playTrack({ track: { uri: playlist.uri } })}>
                  {playlist.images[0] && (
                    <img src={playlist.images[0].url} alt={playlist.name} />
                  )}
                  <div className='body_suggestedInfo'>
                    <h1>{playlist.name}</h1>
                    <p>{playlist.owner.display_name}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className='suggested_h2'>Fresh New Music</h2>
            <div className='fresh'>
              {freshNewMusic.map((album) => (
                <div key={album.id} className='freshItem' onClick={() => playTrack({ track: { uri: album.uri } })}>
                  <img src={album.images[0].url} alt={album.name} />
                  <div className='freshInfo'>
                    <h1>{album.name}</h1>
                    <p>{album.artists.map((artist) => artist.name).join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className='suggested_h2'>Top Artists</h2>
            <div className='topArtists'>
              {topArtists.map((artist) => (
                <div key={artist.id} className='topArtist' onClick={() => console.log(artist)}>
                  <img src={artist.images[0].url} alt={artist.name} />
                  <div className='topArtistInfo'>
                    <h1>{artist.name}</h1>
                    {/* Additional artist information if needed */}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Body;
