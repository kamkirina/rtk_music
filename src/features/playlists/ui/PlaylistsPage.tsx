import { useFetchPlaylistsQuery } from '../api/playlistApi'
import { CreatePlaylistForm } from './CreatePlaylistForm/CreatePlaylistForm'
import s from './PlaylistsPage.module.css'
import { useState, type ChangeEvent } from 'react'
import { useDebounceValue } from '@/common/hooks'
import { Pagination } from '@/common/components'
import { PlaylistList } from './PlaylistList/PlaylistList'

export const PlaylistsPage = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [size, setSize] = useState(4)
  const debouncedSearch = useDebounceValue(search)
  const { data, isLoading } = useFetchPlaylistsQuery({
    search: debouncedSearch,
    pageNumber: currentPage,
    pageSize: size,
  })

  const changePageSize = (size: number) => {
    setCurrentPage(1)
    setSize(size)
  }

  const searchPlaylistHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setCurrentPage(1)
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm setCurrentPage={setCurrentPage}/>
      <input type="search" placeholder="Search playlist by title" onChange={(event) => searchPlaylistHandler(event)} />
      <PlaylistList isLoading={isLoading} playlists={data?.data || []} />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        size={size}
        changePageSize={changePageSize}
        pagesCount={data?.meta.pagesCount || 1}
      />
    </div>
  )
}
