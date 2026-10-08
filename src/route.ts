import { useEffect, useState } from 'react'

// Tiny hash router: `#/` -> home, `#/shop` -> browse grid, `#/item/<id>` ->
// product page, `#/watchlist`, `#/account`, `#/messages` -> account-area pages.
// Hash-based so GitHub Pages needs no rewrite rules and every page is linkable.
export type Route =
  | { page: 'home' }
  | { page: 'browse' }
  | { page: 'item'; id: string }
  | { page: 'watchlist' }
  | { page: 'account' }
  | { page: 'messages' }

const parse = (): Route => {
  const m = location.hash.match(/^#\/item\/(.+)$/)
  if (m) return { page: 'item', id: decodeURIComponent(m[1]) }
  if (location.hash === '#/shop') return { page: 'browse' }
  if (location.hash === '#/watchlist') return { page: 'watchlist' }
  if (location.hash === '#/account') return { page: 'account' }
  if (location.hash === '#/messages') return { page: 'messages' }
  return { page: 'home' }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const onChange = () => {
      setRoute(parse())
      window.scrollTo(0, 0)
    }
    addEventListener('hashchange', onChange)
    return () => removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export const itemHref = (id: string) => `#/item/${id}`
