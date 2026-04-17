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

  fastify.get("/", getTickets)

  fastify.get("/:id", getTicketById)

  fastify.post("/", createTicket)

  fastify.put("/:id", updateTicket)

  fastify.patch("/:id/state", updateTicketState)

  // ✅ Ruta protegida: requiere token JWT y valida asignación + permiso
  fastify.patch("/:id/move", { preHandler: [verifyToken] }, moveTicket)

  fastify.delete("/:id", deleteTicket)

}