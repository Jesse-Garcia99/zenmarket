import { useEffect, useState } from 'react'

// Tiny hash router: `#/` -> browse grid, `#/item/<id>` -> product page.
// Hash-based so GitHub Pages needs no rewrite rules and every page is linkable.
export type Route = { page: 'browse' } | { page: 'item'; id: string }

const parse = (): Route => {
  const m = location.hash.match(/^#\/item\/(.+)$/)
  return m ? { page: 'item', id: decodeURIComponent(m[1]) } : { page: 'browse' }
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
