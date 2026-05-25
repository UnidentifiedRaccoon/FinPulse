import { createApp } from './app'

const port = Number(process.env.PORT ?? process.env.FINPULSE_API_PORT ?? 3001)
const host = process.env.FINPULSE_API_HOST ?? '127.0.0.1'

const { app } = await createApp({
  logger: true,
})

try {
  await app.listen({ port, host })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
