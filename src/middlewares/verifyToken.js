import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET

export async function verifyToken(request, reply) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return reply.code(403).send({
      statusCode: 403,
      intOpCode: "SxAU403",
      data: { message: "Token requerido" }
    })
  }

  if (!authHeader.startsWith("Bearer ")) {
    return reply.code(401).send({
      statusCode: 401,
      intOpCode: "SxAU401",
      data: { message: "Formato de token inválido" }
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, SECRET)
    request.user = decoded
  } catch (err) {
    return reply.code(401).send({
      statusCode: 401,
      intOpCode: "SxAU401",
      data: { message: "Token inválido o expirado" }
    })
  }
}