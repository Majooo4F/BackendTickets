import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketState,
  moveTicket,
  deleteTicket
} from "../controllers/tickets.controller.js"

export default async function (fastify) {

  fastify.get("/", getTickets)

  fastify.get("/:id", getTicketById)

  fastify.post("/", createTicket)

  fastify.put("/:id", updateTicket)

  fastify.patch("/:id/state", updateTicketState)

  fastify.patch("/:id/move", moveTicket)

  fastify.delete("/:id", deleteTicket)

}