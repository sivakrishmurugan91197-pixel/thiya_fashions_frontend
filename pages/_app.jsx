import '@/styles/globals.css';
import { AppearanceProvider } from '@/contexts/AppearanceContext';
import { CartProvider } from '@/contexts/CartContext';

export default function App({ Component, pageProps }) {
  return (
    <AppearanceProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AppearanceProvider>
  );
}
