'use strict'
const { authenticate, isAuthenticated } = require('@secrets/auth')
const fp = require('fastify-plugin')
async function authentication (fastify, options) {
    fastify
    .register(require('fastify-auth'))
    .register(require('fastify-jwt'), {
        secret: 'Super-secret'
    })
    .decorate('validateJWT', async (request, reply) => {
        try {
            await request.jwtVerify()
            const {user} = request.user
            console.log(user)
            if(!await isAuthenticated(user)){
                reply.code(401).send(new Error('Unauthorized'))
            }
            
        } catch (err) {
            reply.send(err)
        }
    })
    .decorate('ValidateUserPassword', async (request, reply) => {
        const { username, password } = request.body
        if(await authenticate(username, password)) {
            request.user =  username
            return
        }else {
            reply.code(401).send(new Error('Forbidden'))
        }
    })
    .after(() => {
        fastify
        .post('/auth', { preValidation:fastify.auth([fastify.ValidateUserPassword]) }, async (request, reply) => {
            const user = request.user
            fastify.log.info(user)
            const token = fastify.jwt.sign({user})
            return token
        })
    })
}
module.exports = fp(authentication)