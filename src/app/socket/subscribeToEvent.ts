import type { SocketEvents } from '@/common/constants'

import { getSocket } from './getSocket'

export const subscribeToEvent = <T>(event: SocketEvents, callback: (msg: T) => void) => {
  const socket = getSocket()

  socket.on(event, callback)

  return () => {
    socket.off(event, callback)
  }
}
