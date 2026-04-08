import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketState,
  moveTicket,
  deleteTicket
} from "../controllers/tickets.controller.js"

import { verifyToken } from "../middlewares/verifyToken.js"

export default async function (fastify) {

  fastify.get("/", { preHandler: verifyToken }, getTickets)

  fastify.get("/:id", { preHandler: verifyToken }, getTicketById)

  fastify.post("/", { preHandler: verifyToken }, createTicket)

  fastify.put("/:id", { preHandler: verifyToken }, updateTicket)

  fastify.patch("/:id/state", { preHandler: verifyToken }, updateTicketState)

  fastify.patch("/:id/move", { preHandler: verifyToken }, moveTicket)

  fastify.delete("/:id", { preHandler: verifyToken }, deleteTicket)

}