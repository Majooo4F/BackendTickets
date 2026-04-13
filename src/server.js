import Fastify from "fastify"
import cors from "@fastify/cors"
import dotenv from "dotenv"

import ticketsRoutes from "./routes/tickets.routes.js"

dotenv.config()

const fastify = Fastify({ logger: true })

await fastify.register(cors)

await fastify.register(ticketsRoutes, { prefix: "/tickets" })

fastify.get("/", async () => {
  return { message: "Microservicio de tickets funcionando 🚀" }
})

const PORT = process.env.PORT || 3003

fastify.listen({ port: PORT }, (err, address) => {

  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }

  console.log(`Tickets Service corriendo en ${address}`)

})