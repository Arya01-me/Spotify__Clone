import React from 'react';
import './Footer.css';
import { PlayCircleOutline, PlaylistPlay, Repeat, Shuffle, SkipNext, SkipPrevious, VolumeDown } from '@mui/icons-material';
import { Grid, Slider } from '@mui/material';
import { useDataLayerValue } from './DataLayer';

function Footer({ spotify }) {
  const [{ currentlyPlaying, token }] = useDataLayerValue(); // Assuming 'token' is stored in DataLayer

  const playPauseTrack = async () => {
    if (currentlyPlaying) {
      const endpoint = currentlyPlaying.is_playing ? 'pause' : 'play';
      try {
        await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error playing/pausing track:', error);
      }
    }
  };

  return (
    <div className='footer'>
      <div className='footer_left'>
        {currentlyPlaying && currentlyPlaying.album && (
          <>
            <img className='albumLogo' src={currentlyPlaying.album.images[0].url} alt={currentlyPlaying.name} />
            <div className='songInfo'>
              <h4>{currentlyPlaying.name}</h4>
              <p>{currentlyPlaying.artists.map((artist) => artist.name).join(', ')}</p>
            </div>
          </>
        )}
      </div>
  
      <div className='footer_center'>
        <Shuffle className='footer_green' />
        <SkipPrevious className='skipPrevious' />
        <PlayCircleOutline fontSize='large' className='footer_play' onClick={playPauseTrack} />
        <SkipNext className='skipNext' />
        <Repeat className='footer_green' />
      </div>
  
      <div className='footer_right'>
        <Grid container spacing={2}>
          <Grid item>
            <PlaylistPlay />
          </Grid>
          <Grid item>
            <VolumeDown />
          </Grid>
          <Grid item>
            <Slider />
          </Grid>
        </Grid>
      </div>
    </div>
  );
  }

export default Footer;
