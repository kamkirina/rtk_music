import { useSelector } from 'react-redux'
import type { RootState } from '@/app/model/store'
import { baseApi } from '@/app/api/baseApi'
import { playlistsApi } from '@/features/playlists/api/playlistApi'
import { tracksApi } from '@/features/tracks/api/tracksApi'

const excludedEndpoints = [playlistsApi.endpoints.fetchPlaylists.name, tracksApi.endpoints.fetchTracks.name]

export const useGlobalLoading = () => {
  return useSelector((state: RootState) => {
    const apiState = state[baseApi.reducerPath as keyof RootState] as any

    if (!apiState) return false

    const queries = Object.values(apiState.queries || {})
    const mutations = Object.values(apiState.mutations || {})

    const hasActiveQueries = queries.some((query: any) => {
      if (query?.status !== 'pending') return
      if (excludedEndpoints.includes(query.endpointName)) {
        const completedQueries = queries.filter((q: any) => q?.status === 'fulfilled')
        return completedQueries.length > 0
      }
    })

    const hasActiveMutations = mutations.some((mutation: any) => mutation?.status === 'pending')

    return hasActiveQueries || hasActiveMutations
  })
}
