import type { PlaylistData } from '../../api/playlistsApi.types'
import { PlaylistDescription } from './PlaylistDescription/PlaylistDescription'
import { PlaylistCover } from './PlaylistCover/PlaylistCover'

type Props = {
  playlist: PlaylistData
  deletePlaylistHandler: (playlistId: string) => void
  editPlaylistHandler: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, deletePlaylistHandler, editPlaylistHandler }: Props) => {
  return (
    <>
      <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images} />
      <PlaylistDescription attributes={playlist.attributes} />
      <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
      <button onClick={() => editPlaylistHandler(playlist)}>update</button>
    </>
  )
}
