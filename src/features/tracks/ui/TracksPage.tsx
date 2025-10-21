import { useInfinityScroll } from '@/common/hooks'
import { useFetchTracksInfiniteQuery } from '../api/tracksApi'
import { TracksList } from './TracksList'
import { LoadingTrigger } from './LoadingTrigger/LoadingTrigger'

export const TracksPage = () => {
  const { data, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage } = useFetchTracksInfiniteQuery()

  const { observerRef } = useInfinityScroll({
    hasNextPage,
    isFetching,
    fetchNextPage,
    rootMargin: '100px',
    threshold: 0.1,
  })

  const pages = data?.pages.flatMap((page) => page.data) || []

  return (
    <div>
      <h1>Tracks page</h1>
      <TracksList tracks={pages} />
      {hasNextPage && <LoadingTrigger isFetchingNextPage={isFetchingNextPage} observerRef={observerRef} />}
      {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
    </div>
  )
}
