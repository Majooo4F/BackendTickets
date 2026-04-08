import supabase from "../config/supabase.js"

// 🔹 GET TODOS
export const getTickets = async (request, reply) => {
  const { data, error } = await supabase.from("tickets").select("*")

  if (error) return reply.code(500).send({ message: error.message })

  return reply.send(data)
}

// 🔹 GET POR ID
export const getTicketById = async (request, reply) => {
  const { id } = request.params

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return reply.code(500).send({ message: error.message })

  return reply.send(data)
}

// 🔹 CREAR
export const createTicket = async (request, reply) => {
  const {
    grupo_id,
    titulo,
    descripcion,
    asignado_id,
    prioridad
  } = request.body

  const autor_id = request.user.id

  if (!grupo_id || !titulo) {
    return reply.code(400).send({
      message: "grupo_id y titulo son obligatorios"
    })
  }

  const { data, error } = await supabase
    .from("tickets")
    .insert([{
      grupo_id,
      titulo,
      descripcion,
      autor_id,
      asignado_id,
      prioridad
    }])
    .select()

  if (error) return reply.code(500).send({ message: error.message })

  return reply.code(201).send(data)
}

// 🔹 UPDATE
export const updateTicket = async (request, reply) => {
  const { id } = request.params
  const { titulo, descripcion, prioridad } = request.body

  const { data, error } = await supabase
    .from("tickets")
    .update({ titulo, descripcion, prioridad })
    .eq("id", id)
    .select()

  if (error) return reply.code(500).send({ message: error.message })

  return reply.send(data)
}

// 🔹 CAMBIAR ESTADO
export const updateTicketState = async (request, reply) => {
  const { id } = request.params
  const { estado } = request.body

  const { data, error } = await supabase
    .from("tickets")
    .update({ estado })
    .eq("id", id)
    .select()

  if (error) return reply.code(500).send({ message: error.message })

  return reply.send(data)
}

// 🔹 ASIGNAR
export const moveTicket = async (request, reply) => {
  const { id } = request.params
  const { asignado_id } = request.body

  const { data, error } = await supabase
    .from("tickets")
    .update({ asignado_id })
    .eq("id", id)
    .select()

  if (error) return reply.code(500).send({ message: error.message })

  return reply.send(data)
}

// 🔹 DELETE
export const deleteTicket = async (request, reply) => {
  const { id } = request.params

  const { error } = await supabase
    .from("tickets")
    .delete()
    .eq("id", id)

  if (error) return reply.code(500).send({ message: error.message })

  return reply.send({ message: "Ticket eliminado" })
}