'use strict'

const { userServices } = require('@secrets/services')

async function userRoutes (fastify, options) {
    fastify
    .addSchema({
        $id: 'publicUser',
        type: 'object',
        properties: {
            username: { type: 'string' },
            fullname: { type: 'string' }
        }
    })
    .addSchema({
        $id: 'Users',
        type: 'array',
        items: {
            $ref: 'publicUser#'
        }
    })
    .addSchema({
        $id: 'createUser',
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' }
        }
    })  

    .get('/users', {
        schema: {
            response: {
                200: 'Users#'
            }
        }
    }, async (request, reply) => {
        const user = await userServices.listUsers()
        return user.rows
    })
    .post('/users', {
        schema: {
            body: 'createUser#',
            response: {
                201: 'publicUser#'
            }
        }
    },async (request, reply) => {
        const  { username, fullName, password } = request.body
        const createdUser = await userServices.createUser(username, password, fullName)
        reply.code(201)
        return createdUser
    })

    
}

module.exports = userRoutes