import type { Ref } from "react"

type Props = {
  observerRef: Ref<HTMLDivElement> | undefined
  isFetchingNextPage: boolean
}

export const LoadingTrigger = ({ observerRef, isFetchingNextPage }: Props) => {
  return (
    <div ref={observerRef}>
      {isFetchingNextPage ? <div>Loading more tracks..</div> : <div style={{ height: '10px' }}></div>}
    </div>
  )
}
