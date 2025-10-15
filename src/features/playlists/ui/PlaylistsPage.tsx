import { useForm } from 'react-hook-form'
import { useDeletePlaylistsMutation, useFetchPlaylistsQuery } from '../api/playlistApi'
import type { PlaylistData, UpdatePlaylistArgs } from '../api/playlistsApi.types'
import { CreatePlaylistForm } from './CreatePlaylistForm/CreatePlaylistForm'
import s from './PlaylistsPage.module.css'
import { useState } from 'react'
import { PlaylistItem } from './PlaylistItem/PlaylistItem'
import { EditPlaylistForm } from './EditPlaylistForm/EditPlaylistForm'

export const PlaylistsPage = () => {
  const [search, setSearch] = useState('')
  const { data } = useFetchPlaylistsQuery({ search })
  const [deletePlaylists] = useDeletePlaylistsMutation()

  const [playlistId, setPlaylistId] = useState<string | null>()
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm('Are you shure you want to delete this playlist?')) {
      deletePlaylists(playlistId)
    }
  }

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id)
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map((tag) => tag.id),
      })
    } else setPlaylistId(null)
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <input
        type="search"
        placeholder="Search playlist by title"
        onChange={(event) => setSearch(event.currentTarget.value)}
      />
      <div className={s.items}>
        {data?.data.map((playlist) => {
          const isEditing = playlistId === playlist.id
          return (
            <div className={s.item} key={playlist.id}>
              {isEditing ? (
                <EditPlaylistForm
                  playlistId={playlistId}
                  setPlaylistId={setPlaylistId}
                  register={register}
                  handleSubmit={handleSubmit}
                  editPlaylist={editPlaylistHandler}
                />
              ) : (
                <PlaylistItem
                  playlist={playlist}
                  editPlaylistHandler={editPlaylistHandler}
                  deletePlaylistHandler={deletePlaylistHandler}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
