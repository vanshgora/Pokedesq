import { Outlet } from 'react-router-dom';
import Header from './Components/Common/Header/Header';

export default function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
