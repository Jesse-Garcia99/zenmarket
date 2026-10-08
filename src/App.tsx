import { ZenProvider, useZen } from './state'
import { DemoStrip, Footer, Header, StoreTabs } from './components/SiteChrome'
import { ZenMatchBar } from './components/ZenMatchBar'
import { ProductSection } from './components/ProductSection'
import { RelatedItems } from './components/RelatedItems'
import { BrowsePage } from './components/BrowsePage'
import { WatchlistPage } from './components/WatchlistPage'
import { AccountPage } from './components/AccountPage'
import { MessagesPage } from './components/MessagesPage'
import { WarehouseDrawer } from './components/WarehouseDrawer'
import { HomePage } from './components/HomePage'

function Page() {
  const { route } = useZen()
  switch (route.page) {
    case 'home':
      return <HomePage />
    case 'item':
      return (
        <>
          <ProductSection />
          <RelatedItems />
        </>
      )
    case 'watchlist':
      return <WatchlistPage />
    case 'account':
      return <AccountPage />
    case 'messages':
      return <MessagesPage />
    default:
      return <BrowsePage />
  }
}

export default function App() {
  return (
    <ZenProvider>
      <DemoStrip />
      <Header />
      <StoreTabs />
      <ZenMatchBar />
      <main className="pb-8">
        <Page />
      </main>
      <Footer />
      <WarehouseDrawer />
    </ZenProvider>
  )
}
