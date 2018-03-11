const { GraphQLServer, PubSub } = require('graphql-yoga')
const ble = require('./ble')
const wireless = require('./wireless-tools')
const loader = require('./loader')
const PORT = process.env.PORT || 4000

const boot = async () => {
  const dataSources = await loader()
  const { prepare } = require('@gramps/gramps')

  // merge all data sources to a single schema
  const opts = prepare({ dataSources })

  const pubsub = new PubSub()
  const server = new GraphQLServer({
    ...opts,
    context: ({ request, connection }) => ({
      request,
      connection,
      pubsub,
    }),
  })

  server.start(
    {
      subscriptions: {
        onConnect: (connectionParams, websocket) => {
          return {
            websocket,
          }
        },
      },
      port: PORT,
    },
    () => console.log('Server is running on localhost:4000'),
  )
}

boot()
