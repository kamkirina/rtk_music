import { useCallback, useEffect, useRef } from 'react'

type Props = {
  hasNextPage: boolean
  isFetching: boolean
  fetchNextPage: () => void
  rootMargin: string
  threshold: number
}

export const useInfinityScroll = ({ hasNextPage, isFetching, fetchNextPage, rootMargin, threshold }: Props) => {
  const observerRef = useRef<HTMLDivElement>(null)

  const loadMoreHandler = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetching, fetchNextPage])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.length > 0 && entries[0].isIntersecting) {
          loadMoreHandler()
        }
      },
      {
        rootMargin: rootMargin,
        threshold: threshold,
      },
    )

    const currentObserverRef = observerRef.current

    if (currentObserverRef) {
      observer.observe(currentObserverRef)
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef)
      }
    }
  }, [loadMoreHandler, rootMargin, threshold])

  return { observerRef }
}
