import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistUpdatedEvent,
  UpdatePlaylistArgs,
} from './playlistsApi.types'
import { baseApi } from '@/app/api/baseApi'
import { playlistCreateResponseSchema, playlistsResponseSchema } from '../model/playlists.schemas'
import { imagesSchema } from '@/common/schemas'
import { withZodCatch } from '@/common/utils'
import { SOCKET_EVENTS } from '@/common/constants'
import { subscribeToEvent } from '@/app/socket'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => ({ url: `playlists`, params }),
      ...withZodCatch(playlistsResponseSchema),
      keepUnusedDataFor: 0,
      onCacheEntryAdded: async (_args, { cacheDataLoaded, updateCachedData, cacheEntryRemoved }) => {
        await cacheDataLoaded

        const unsubscribes = [
          subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, (msg) => {
            // 1 вариант
            const newPlaylist = msg.payload.data
            updateCachedData((state) => {
              state.data.pop()
              state.data.unshift(newPlaylist)
              state.meta.totalCount = state.meta.totalCount + 1
              state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
            })
            // 2 вариант
            // dispatch(playlistsApi.util.invalidateTags(['Playlist']))
          }),
          subscribeToEvent<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, (msg) => {
            // 1 вариант
            const newPlaylist = msg.payload.data
            updateCachedData((state) => {
              const index = state.data.findIndex((playlist) => playlist.id === newPlaylist.id)
              if (index !== -1) {
                state.data[index] = { ...state.data[index], ...newPlaylist }
              }
            })
            // 2 вариант
            // dispatch(playlistsApi.util.invalidateTags(['Playlist']))
          }),
        ]

        await cacheEntryRemoved

        unsubscribes.forEach((unsubscribe) => unsubscribe())
      },
      providesTags: ['Playlist'],
    }),
    createPlaylists: build.mutation({
      query: (body: CreatePlaylistArgs) => ({
        method: 'post',
        url: 'playlists',
        body,
      }),
      ...withZodCatch(playlistCreateResponseSchema),
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

      onQueryStarted: async ({ playlistId, body }, { dispatch, queryFulfilled, getState }) => {
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

        const patchResults: any[] = []

        args.forEach((arg) => {
          patchResults.push(
            dispatch(
              playlistsApi.util.updateQueryData(
                'fetchPlaylists',
                { pageNumber: arg.pageNumber, pageSize: arg.pageSize, search: arg.search },
                (state) => {
                  const index = state.data.findIndex((playlist) => playlist.id === playlistId)
                  if (index !== -1) state.data[index].attributes = { ...state.data[index].attributes, ...body }
                },
              ),
            ),
          )
        })

        try {
          await queryFulfilled
        } catch (err) {
          patchResults.forEach((patchResult) => {
            patchResult.undo()
          })
        }
      },

      invalidatesTags: ['Playlist'],
    }),
    uploadPlaylistCover: build.mutation({
      query: ({ playlistId, file }: { playlistId: string; file: File }) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          method: 'post',
          url: `playlists/${playlistId}/images/main`,
          body: formData,
        }
      },
      ...withZodCatch(imagesSchema),
      invalidatesTags: ['Playlist'],
    }),
    deletePlaylistCover: build.mutation<void, string>({
      query: (playlistId) => {
        return {
          method: 'delete',
          url: `playlists/${playlistId}/images/main`,
        }
      },
      invalidatesTags: ['Playlist'],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistsMutation,
  useDeletePlaylistsMutation,
  useUpdatePlaylistsMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi
