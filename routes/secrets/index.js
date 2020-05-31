'use strict'

const { secretServices } = require('@secrets/services')

async function secretRoutes (fastify, options) {
    fastify
    .addSchema({
        $id: 'publicSecret',
        type: 'object',
        properties: {
            username: { type: 'string' },
            name: { type: 'string'},
            createdAt: { type: 'string' }
        }
    })
    .addSchema({
        $id: 'createSecret',
        type: 'object',
        properties: {
            username: { type: 'string' },
            name: { type: 'string' },
            value: { type: 'string' }
        },
        required: ['username', 'name', 'value']
    })
    .addSchema({
        $id: 'getSecret',
        type: 'object',
        properties: {
            name: { type: 'string' },
            value: { type: 'string' }
        }
    })
    .addSchema({
        $id: 'secrets',
        type: 'array',
        items: { $ref: 'publicSecret#' }
    })
    .addSchema({
        $id: 'params',
        type: 'string',
        params: {
            username: { type: 'string' },
            name: { type: 'string' }
        }
    })
    .addSchema({
        $id: 'deleteSecret',
        type: 'object',
        properties: {
            username: { type: 'string' },
            name: { type: 'string' }
        },
        required: ['username', 'name']
    })
    .get('/secrets', {
        preValidation: fastify.auth([fastify.validateJWT]),
        schema: {
            response: {
                200: 'secrets#'
            }
        }
    }, async (request, reply) => {
        const {user} = request.user
        console.log(user)
        const secrets = await secretServices.listSecrets(user)
        return secrets.rows
    })
    .get('/secrets/:username/:name', {
        preValidation: fastify.auth([fastify.validateJWT]),
        schema: {
            response: {
                200: 'getSecret#'
            }
        }
    } ,async (request, reply) => {
        const {user} = request.user
        const { username, name } = request.params
        if(username != user){
            reply.code(401)
            return new Error('Unauthorized')
        }
        const secret = await secretServices.getSecret(user, name)
        if(!secret){
            return new Error('Not found')
        }
        return secret
    })
    .post('/secrets', {
        preValidation: fastify.auth([fastify.validateJWT]),
        schema: {
            body: 'createSecret#',
            response:{
                200: 'publicSecret#'
            }
        }
    }, async (request, reply) => {
        const {user} = request.user
        const { username, name, value } = request.body
        if(username != user){
            reply.code(401)
            return new Error('Unauthorized')
        }
        const secretCreated = await secretServices.createSecret(user, name, value)
        return secretCreated
    })
    .put('/secrets', {
        preValidation: fastify.auth([fastify.validateJWT]),
        schema: {
            body: 'createSecret#'
        }
    }, async (request, reply) => {
        const {user} = request.user
        const { username, name, value } = request.body
        if(username != user){
            reply.code(401)
            return new Error('Unauthorized')
        }
        const updatedSecret = await secretServices.updateSecret(user, name, value)
        
        return {
            ok: true,
            status: 'Updated',
            info: updatedSecret
        }
    })
    .delete('/secrets', {
        preValidation: fastify.auth([fastify.validateJWT]),
        schema: {
            body: 'deleteSecret#'
        }
    }, async (request, reply) => {
        const {user} = request.user
        const { username, name } = request.body
        if(username != user){
            reply.code(401)
            return new Error('Unauthorized')
        }
        const deletedSecret = await secretServices.deleteSecret(user, name)
        console.log(deletedSecret)
        return{
            ok: true,
            status: 'Deleted',
            info: deletedSecret
        }
    })
    
}

module.exports = secretRoutes