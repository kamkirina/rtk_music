import { useForm } from 'react-hook-form'
import { useDeletePlaylistsMutation } from '../../api/playlistApi'
import { EditPlaylistForm } from '../EditPlaylistForm/EditPlaylistForm'
import { PlaylistItem } from '../PlaylistItem/PlaylistItem'
import s from './PlaylistList.module.css'
import { useState } from 'react'
import type { PlaylistData, UpdatePlaylistArgs } from '../../api/playlistsApi.types'

type Props = {
  playlists: PlaylistData[]
  isLoading: boolean
}

export const PlaylistList = ({ playlists, isLoading }: Props) => {
  const [playlistId, setPlaylistId] = useState<string | null>()
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()
  const [deletePlaylists] = useDeletePlaylistsMutation()

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
    <div className={s.items}>
      {!playlists.length && !isLoading && <h2>Playlists not found</h2>}
      {playlists.map((playlist) => {
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
  )
}
