import { useUpdatePlaylistsMutation } from '../../api/playlistApi'
import type { UpdatePlaylistArgs } from '../../api/playlistsApi.types'
import type { UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'

type Props = {
  playlistId: string
  setPlaylistId: (playlitId: null) => void
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
  register: UseFormRegister<UpdatePlaylistArgs>
  editPlaylist: (arg: null) => void
}

export const EditPlaylistForm = ({ playlistId, setPlaylistId, handleSubmit, register, editPlaylist }: Props) => {
  const [updatePlaylist] = useUpdatePlaylistsMutation()

  const onSubmit = (body: UpdatePlaylistArgs) => {
    if (!playlistId) return
    updatePlaylist({ playlistId, body })
    setPlaylistId(null)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('title')} placeholder={'title'} />
      </div>
      <div>
        <input {...register('description')} placeholder={'description'} />
      </div>
      <button type={'submit'}>save</button>
      <button type={'button'} onClick={() => editPlaylist(null)}>
        cancel
      </button>
    </form>
  )
}
