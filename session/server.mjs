import 'make-promises-safe'

const serve = async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  console.log('Started session server...');
}

export default serve