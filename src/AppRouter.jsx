import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import RootLayout from './RootLayout.jsx';
import PokemonCardGallery from './Components/Pages/PokemonCardGallery/PokemonCardGallery.jsx';
import Favorites from './Components/Pages/Favorites/Favorites.jsx';
import PokemonDetailView from './Components/PokemonDetailView/PokemonDetailView.jsx';
import NotFound from './Components/Pages/NotFound/NotFound.jsx';
import PokemonComparison from './Components/Pages/PokemonCompare/PokemonCompare.jsx';
import PokeworldMap from './Components/Pages/PokeWorldMap/PokeworldMap.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <PokemonCardGallery /> },
      { path: 'favorites', element: <Favorites /> },
      { path: 'pokemon/:id', element: <PokemonDetailView /> },
      { path: 'compare', element: <PokemonComparison /> },
      { path: 'explore-pokeworld', element: <PokeworldMap /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
