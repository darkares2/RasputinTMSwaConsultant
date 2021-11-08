import React from 'react';
import { MainMenu } from './mainmenu';

function App() {
  const appStyle = {
    height: '250px',
      display: 'flex'
  };

  return <div style={appStyle}>
            <MainMenu />
        </div>;
}

export default App;
