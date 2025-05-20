import { Outlet } from 'react-router-dom';
import Header from './Components/Common/Header/Header';
import { useState } from 'react';

export default function RootLayout() {

  const [theme, setTheme] = useState('light');

  return (
    <div data-theme={theme} className='dark:bg-gray-900'>
      <Header theme={theme} setTheme={setTheme}/>
      <Outlet/>
    </div>
  );
}
