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

// 🔹 ASIGNAR
export const moveTicket = async (request, reply) => {
  try {
    const { id } = request.params
    const { asignado_id } = request.body

    if (!asignado_id) {
      return sendResponse(reply, {
        statusCode: 400,
        intOpCode: "SxTK400",
        data: { message: "asignado_id es obligatorio" }
      })
    }

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