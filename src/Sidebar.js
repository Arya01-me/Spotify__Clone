import React from 'react';
import './Sidebar.css';
import SidebarOptions from './SidebarOptions';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { useDataLayerValue } from './DataLayer';

function Sidebar() {
  const [{ playlists }, dispatch] = useDataLayerValue();

  const handlePlaylistClick = (playlistId) => {
    dispatch({
      type: 'SET_SELECTED_PLAYLIST',
      selectedPlaylistId: playlistId,
    });
  };

  const handleHomeClick = () => {
    dispatch({
      type: 'SET_SELECTED_PLAYLIST',
      selectedPlaylistId: null,
    });
  };

  return (
    <div className='sidebar'>
      <img
        className='app_logo'
        src='https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg'
        alt=''
      />
      <SidebarOptions Icon={HomeIcon} option="Home" onClick={handleHomeClick} />
      <SidebarOptions Icon={SearchIcon} option="Search" />
      <SidebarOptions Icon={LibraryMusicIcon} option="Your Library" />

      <br />
      <strong className='sidebar_title'>PLAYLISTS</strong>
      <hr />

      {playlists?.items?.map((playlist) => (
        <SidebarOptions
          key={playlist.id}
          option={playlist.name}
          onClick={() => handlePlaylistClick(playlist.id)}
        />
      ))}
    </div>
  );
}

export default Sidebar;
