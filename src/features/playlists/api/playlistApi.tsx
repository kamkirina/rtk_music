import type { CreatePlaylistArgs, PlaylistData, PlaylistsResponse, UpdatePlaylistArgs } from './playlistsApi.types'
import { baseApi } from '@/app/api/baseApi'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => `playlists`,
      providesTags: ['Playlist'],
    }),
    createPlaylists: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({
        method: 'post',
        url: 'playlists',
        body,
      }),
      invalidatesTags: ['Playlist'],
    }),
    deletePlaylists: build.mutation<void, string>({
      query: (playlistId) => ({
        method: 'delete',
        url: `playlists/${playlistId}`,
      }),
      invalidatesTags: ['Playlist'],
    }),
    updatePlaylists: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({
        method: 'put',
        url: `playlists/${playlistId}`,
        body,
      }),
      invalidatesTags: ['Playlist'],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistsMutation,
  useDeletePlaylistsMutation,
  useUpdatePlaylistsMutation,
} = playlistsApi
