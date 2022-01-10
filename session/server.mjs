import 'make-promises-safe'
import ws from 'fastify-websocket'

import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})

fastify.register(ws)

let connections = []

fastify.get('/', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
  connections.push(req.headers["sec-websocket-key"])
  connection.socket.send(`key:${req.headers["sec-websocket-key"]}`)

  connection.socket.on('close', message => {
    connections = connections.filter(id => id != req.headers["sec-websocket-key"])
  })
})

fastify.post('/publish', (req) => {
  Array.from(fastify.websocketServer.clients).map(client => client.send(req.body))
  fastify.log.debug(`published:${req.body}`)
  return "published"
})

fastify.get('/connections', () => {
  return connections;
})

fastify.get('/alive', (req, reply) => {  
  if (connections.includes(req.query.id)) {
    return "alive";
  }
  
  reply.code(404)
  return "dead"
})

// Run the server!
fastify.listen(5001, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
