// helpers/response.js — Microservicio Tickets (Fastify)
export const sendResponse = (reply, { statusCode = 200, intOpCode, data = null }) => {
  return reply.code(statusCode).send({
    statusCode,
    intOpCode,
    data
  })
}