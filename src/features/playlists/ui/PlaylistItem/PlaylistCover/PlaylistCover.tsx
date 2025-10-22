import { useDeletePlaylistCoverMutation, useUploadPlaylistCoverMutation } from '@/features/playlists/api/playlistApi'
import defaultCover from '@/assets/images/default-playlist-cover.png'
import type { ChangeEvent } from 'react'
import s from './PlaylistCover.module.css'
import type { Images } from '@/common/types'
import { errorToast } from '@/common/utils'

type Props = {
  playlistId: string
  images: Images
}

export const PlaylistCover = ({ playlistId, images }: Props) => {
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const maxSize = 1024 * 1024 // 1 MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

  const originalCover = images.main.find((img) => img.type === 'original')
  const src = originalCover ? originalCover.url : defaultCover

  const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.length && event.target.files[0]

    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      errorToast('Only JPEG, PNG or GIF images are allowed', { type: 'error', theme: 'colored' })
      return
    }

    if (file.size > maxSize) {
      errorToast(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`, {
        type: 'error',
        theme: 'colored',
      })
      return
    }

    uploadPlaylistCover({ playlistId, file })
  }

  const deleteCoverHandler = () => {
    deletePlaylistCover(playlistId)
  }

  return (
    <>
      <img src={src} width={'240px'} alt="cover" className={s.cover} />
      <input type="file" accept={'image/jpeg,image/png,image/gif'} onChange={uploadCoverHandler} />
      {originalCover && <button onClick={deleteCoverHandler}>delete</button>}
    </>
  )
}
