import { StoreProvider } from 'easy-peasy';
import store from './store';
import './App.css';
import './BorderAnimation.css';
import ConfigTheme from './ConfigTheme';

export default function App() {
  return (
    <StoreProvider store={store}>
      <ConfigTheme />
    </StoreProvider>
  );
}
