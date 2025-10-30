import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      path: '/api/1.0/ws',
      transports: ['websocket'],
    })
    socket.on('connect', () => console.log('✅ Подключен к серверу'))
    socket.on('disconnect', () => console.log('❌ Соединение разорвано'))
  }

  return socket
}
