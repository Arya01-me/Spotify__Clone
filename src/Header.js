import React, { useState } from 'react';
import './Header.css';
import { Search } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useDataLayerValue } from './DataLayer';

function Header({ spotify }) {
  const [{ user, token }, dispatch] = useDataLayerValue();
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchInput(query);

    if (query.length > 2) {
      try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setSearchResults(data.tracks.items);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const playTrack = (track) => {
    dispatch({
      type: 'SET_CURRENTLY_PLAYING',
      track: track,
    });

    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [track.uri] }),
    }).catch((error) => console.error('Error playing track:', error));

    setSearchInput('');
    setSearchResults([]);
  };

  return (
    <div className='header'>
      <div className='header_left'>
        <Search />
        <input
          className='input1'
          type='text'
          placeholder='Search for Artists, Songs, Podcasts'
          value={searchInput}
          onChange={handleSearch}
        />
        {searchResults.length > 0 && (
          <div className='search_dropdown'>
            {searchResults.map((track) => (
              <div key={track.id} className='search_item' onClick={() => playTrack(track)}>
                <img src={track.album.images[0].url} alt={track.name} />
                <div className='search_item_info'>
                  <h4>{track.name}</h4>
                  <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='header_right'>
        <Avatar src={user?.images[0]?.url} alt={user?.display_name} />
        <h4>{user?.display_name}</h4>
      </div>
    </div>
  );
}

export default Header;
