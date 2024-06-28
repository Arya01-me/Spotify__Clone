import React from 'react';
import './SidebarOptions.css';

function SidebarOptions({ Icon, option, onClick }) {
  return (
    <div className='sidebarOptions' onClick={onClick}>
      {Icon && <Icon className='sidebarOptions_icon' />}
      {Icon ? <h4>{option}</h4> : <p>{option}</p>}
    </div>
  );
}

export default SidebarOptions;
