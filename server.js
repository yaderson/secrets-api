'use strict'

const fastify = require('fastify')({
  logger: {
    prettyPrint: true
  }
})

const port = process.env.PORT || 8080

fastify
    .register(require('fastify-helmet'))
    .register(require('@plugins/authentication'))
    .after(() => {
        fastify
        .register(require('@routes/users'))
        .register(require('@routes/secrets'))
    })

const start = async () => {
  try {
    await fastify.listen(port)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
