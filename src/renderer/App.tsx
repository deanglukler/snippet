import { StoreProvider } from 'easy-peasy';
import store from './store';
import './App.css';
import './BorderAnimation.css';
import ConfigLayer from './ConfigLayer';

export default function App() {
  return (
    <StoreProvider store={store}>
      <ConfigLayer />
    </StoreProvider>
  );
}
