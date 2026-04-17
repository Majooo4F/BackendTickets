import supabase from "../config/supabase.js"
import { sendResponse } from "../helpers/response.js"

// 🔹 GET TODOS
export const getTickets = async (request, reply) => {
  try {
    const { data, error } = await supabase.from("tickets").select("*")

    if (error) {
      return sendResponse(reply, {
        statusCode: 500,
        intOpCode: "SxTK500",
        data: { message: error.message }
      })
    }

    return sendResponse(reply, {
      statusCode: 200,
      intOpCode: "SxTK200",
      data
    })

  } catch (err) {
    return sendResponse(reply, {
      statusCode: 500,
      intOpCode: "SxTK500",
      data: { message: err.message }
    })
  }
}

// 🔹 GET POR ID
export const getTicketById = async (request, reply) => {
  try {
    const { id } = request.params

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      return sendResponse(reply, {
        statusCode: 500,
        intOpCode: "SxTK500",
        data: { message: error.message }
      })
    }

    if (!data) {
      return sendResponse(reply, {
        statusCode: 404,
        intOpCode: "SxTK404",
        data: { message: "Ticket no encontrado" }
      })
    }

    return sendResponse(reply, {
      statusCode: 200,
      intOpCode: "SxTK200",
      data
    })

  } catch (err) {
    return sendResponse(reply, {
      statusCode: 500,
      intOpCode: "SxTK500",
      data: { message: err.message }
    })
  }
}

// 🔹 CREAR
export const createTicket = async (request, reply) => {
  try {
    const { grupo_id, titulo, descripcion, asignado_id, prioridad } = request.body
    const autor_id = request.headers["x-user-id"]

    if (!grupo_id || !titulo) {
      return sendResponse(reply, {
        statusCode: 400,
        intOpCode: "SxTK400",
        data: { message: "grupo_id y titulo son obligatorios" }
      })
    }

    const { data, error } = await supabase
      .from("tickets")
      .insert([{ grupo_id, titulo, descripcion, autor_id, asignado_id, prioridad }])
      .select()

    if (error) {
      return sendResponse(reply, {
        statusCode: 500,
        intOpCode: "SxTK500",
        data: { message: error.message }
      })
    }

    return sendResponse(reply, {
      statusCode: 201,
      intOpCode: "SxTK201",
      data: { message: "Ticket creado", ticket: data }
    })

  } catch (err) {
    return sendResponse(reply, {
      statusCode: 500,
      intOpCode: "SxTK500",
      data: { message: err.message }
    })
  }
}

// 🔹 UPDATE
export const updateTicket = async (request, reply) => {
  try {
    const { id } = request.params
    const { titulo, descripcion, prioridad } = request.body

    if (!titulo && !descripcion && !prioridad) {
      return sendResponse(reply, {
        statusCode: 400,
        intOpCode: "SxTK400",
        data: { message: "Al menos un campo es requerido para actualizar" }
      })
    }

    const { data, error } = await supabase
      .from("tickets")
      .update({ titulo, descripcion, prioridad })
      .eq("id", id)
      .select()

    if (error) {
      return sendResponse(reply, {
        statusCode: 500,
        intOpCode: "SxTK500",
        data: { message: error.message }
      })
    }

    if (!data?.length) {
      return sendResponse(reply, {
        statusCode: 404,
        intOpCode: "SxTK404",
        data: { message: "Ticket no encontrado" }
      })
    }

    return sendResponse(reply, {
      statusCode: 200,
      intOpCode: "SxTK200",
      data: { message: "Ticket actualizado", ticket: data }
    })

  } catch (err) {
    return sendResponse(reply, {
      statusCode: 500,
      intOpCode: "SxTK500",
      data: { message: err.message }
    })
  }
}

// 🔹 CAMBIAR ESTADO
export const updateTicketState = async (request, reply) => {
  try {
    const { id } = request.params
    const { estado } = request.body

    if (!estado) {
      return sendResponse(reply, {
        statusCode: 400,
        intOpCode: "SxTK400",
        data: { message: "estado es obligatorio" }
      })
    }

    const { data, error } = await supabase
      .from("tickets")
      .update({ estado })
      .eq("id", id)
      .select()

    if (error) {
      return sendResponse(reply, {
        statusCode: 500,
        intOpCode: "SxTK500",
        data: { message: error.message }
      })
    }

    if (!data?.length) {
      return sendResponse(reply, {
        statusCode: 404,
        intOpCode: "SxTK404",
        data: { message: "Ticket no encontrado" }
      })
    }

    return sendResponse(reply, {
      statusCode: 200,
      intOpCode: "SxTK200",
      data: { message: "Estado actualizado", ticket: data }
    })

  } catch (err) {
    return sendResponse(reply, {
      statusCode: 500,
      intOpCode: "SxTK500",
      data: { message: err.message }
    })
  }
}

// 🔹 MOVER TICKET (requiere JWT + ser asignado + permiso ticket:mover)
export const moveTicket = async (request, reply) => {
  try {
    const { id } = request.params
    const { asignado_id } = request.body
    const usuarioId = request.user?.id   // inyectado por verifyToken

    if (!asignado_id) {
      return sendResponse(reply, {
        statusCode: 400,
        intOpCode: "SxTK400",
        data: { message: "asignado_id es obligatorio" }
      })
    }

    // ── 1. Obtener el ticket actual ─────────────────────────────────────────
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .select("id, asignado_id, grupo_id")
      .eq("id", id)
      .single()

    if (ticketError || !ticket) {
      return sendResponse(reply, {
        statusCode: 404,
        intOpCode: "SxTK404",
        data: { message: "Ticket no encontrado" }
      })
    }

    // ── 2. Validar que el usuario sea el asignado o que esté sin asignar ───
    const estaAsignado = ticket.asignado_id === usuarioId
    const sinAsignar   = ticket.asignado_id === null || ticket.asignado_id === undefined

    if (!estaAsignado && !sinAsignar) {
      return sendResponse(reply, {
        statusCode: 403,
        intOpCode: "SxTK403",
        data: { message: "Solo puedes mover tickets asignados a ti" }
      })
    }

    // ── 3. Verificar permiso ticket:mover en la tabla grupo_usuario_permisos ─
    const { data: permisoRows, error: permisoError } = await supabase
      .from("grupo_usuario_permisos")
      .select("permiso_id, permisos!inner(nombre)")
      .eq("grupo_id", ticket.grupo_id)
      .eq("usuario_id", usuarioId)
      .eq("activo", true)   // ✅ solo permisos activos (respeta metadata de auditoría)

    if (permisoError) {
      return sendResponse(reply, {
        statusCode: 500,
        intOpCode: "SxTK500",
        data: { message: "Error al verificar permisos" }
      })
    }

    const permisosValidos = new Set(["ticket:mover", "ticket:move", "tickets:move"])
    const tienePermiso = permisoRows?.some((row) => permisosValidos.has(row.permisos?.nombre))

    if (!tienePermiso) {
      return sendResponse(reply, {
        statusCode: 403,
        intOpCode: "SxTK403",
        data: { message: "No tienes permiso para mover tickets en este grupo" }
      })
    }

    // ── 4. Ejecutar la reasignación ─────────────────────────────────────────
    const { data, error } = await supabase
      .from("tickets")
      .update({ asignado_id })
      .eq("id", id)
      .select()

    if (error) {
      return sendResponse(reply, {
        statusCode: 500,
        intOpCode: "SxTK500",
        data: { message: error.message }
      })
    }

    if (!data?.length) {
      return sendResponse(reply, {
        statusCode: 404,
        intOpCode: "SxTK404",
        data: { message: "Ticket no encontrado" }
      })
    }

    return sendResponse(reply, {
      statusCode: 200,
      intOpCode: "SxTK200",
      data: { message: "Ticket asignado", ticket: data }
    })

  } catch (err) {
    return sendResponse(reply, {
      statusCode: 500,
      intOpCode: "SxTK500",
      data: { message: err.message }
    })
  }
}


// 🔹 DELETE
export const deleteTicket = async (request, reply) => {
  try {
    const { id } = request.params

    const { error } = await supabase
      .from("tickets")
      .delete()
      .eq("id", id)

    if (error) {
      return sendResponse(reply, {
        statusCode: 500,
        intOpCode: "SxTK500",
        data: { message: error.message }
      })
    }

    return sendResponse(reply, {
      statusCode: 200,
      intOpCode: "SxTK200",
      data: { message: "Ticket eliminado" }
    })

  } catch (err) {
    return sendResponse(reply, {
      statusCode: 500,
      intOpCode: "SxTK500",
      data: { message: err.message }
    })
  }
}
