import { ShopProvider } from './store/ShopContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import FriendshipStory from './components/FriendshipStory';
import CategoryWorlds from './components/CategoryWorlds';
import Collection from './components/Collection';
import CraftSection from './components/CraftSection';
import CareSection from './components/CareSection';
import BrandStory from './components/BrandStory';
import Concierge from './components/Concierge';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import WishlistDrawer from './components/WishlistDrawer';
import BagDrawer from './components/BagDrawer';
import ProductDetail from './components/ProductDetail';
import Toasts from './components/Toasts';

export default function App() {
  return (
    <ShopProvider>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <FriendshipStory />
        <CategoryWorlds />
        <Collection />
        <CraftSection />
        <CareSection />
        <BrandStory />
        <Concierge />
        <FinalCTA />
      </main>
      <Footer />

      {/* overlays */}
      <SearchModal />
      <WishlistDrawer />
      <BagDrawer />
      <ProductDetail />
      <Toasts />
    </ShopProvider>
  );
}
