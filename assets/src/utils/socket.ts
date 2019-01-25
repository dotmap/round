import { Socket } from 'phoenix'

export const buildSocket = (username: string) => {
  const socket = new Socket('/socket', {
    params: { user_id: username },
    logger: (kind, msg, data) => console.log(`${kind}: ${msg}`, data)
  })
  socket.onError(() => console.log('An error occurred with the connection'))
  socket.onClose(() => console.log('The connection was closed'))
  socket.connect()

  window.addEventListener('focus', () => {
    if (!socket.isConnected()) socket.connect()
  })

  return socket
}
