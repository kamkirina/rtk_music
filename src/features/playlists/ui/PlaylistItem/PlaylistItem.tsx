import type { PlaylistData } from "../../api/playlistsApi.types"

type Props = {
    playlist: PlaylistData,
    deletePlaylistHandler: (playlistId: string) => void,
    editPlaylistHandler: (playlist: PlaylistData) => void,
}


export const PlaylistItem = ({playlist, deletePlaylistHandler, editPlaylistHandler}: Props) => {
  return (
    <>
      <div>title: {playlist.attributes.title}</div>
      <div>description: {playlist.attributes.description}</div>
      <div>userName: {playlist.attributes.user.name}</div>
      <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
      <button onClick={() => editPlaylistHandler(playlist)}>update</button>
    </>
  )
}
