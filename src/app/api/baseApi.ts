import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Playlist', 'Auth'],
  baseQuery: baseQueryWithReauth,
  // skipSchemaValidation: process.env.NODE_ENV === 'production',
  refetchOnReconnect: true,
  endpoints: () => ({}),
})
