import { PlaylistList } from '@/features/playlists/ui/PlaylistList/PlaylistList'
import { useGetMeQuery } from '../../api/authApi'
import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistApi'
import s from './ProfilePage.module.css'
import { CreatePlaylistForm } from '@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm'
import { Navigate } from 'react-router'
import { Path } from '@/common/routing'

export const ProfilePage = () => {
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery()

  const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery(
    { userId: meResponse?.userId },
    { skip: !meResponse?.userId },
  )

  if (isLoading || isMeLoading) return <h1>Skeleton loader...</h1>

  if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />

  return (
    <div>
      <h1>{meResponse?.login} page</h1>
      <div className={s.container}>
        <CreatePlaylistForm />
        <PlaylistList isLoading={isLoading || isMeLoading} playlists={playlistsResponse?.data || []} />
      </div>
    </div>
  )
}
