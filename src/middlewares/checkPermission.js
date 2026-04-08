export function checkPermission(permission) {

  return async function (request, reply) {

    const userPermissions = request.user.permisos || []

    if (!userPermissions.includes(permission)) {

      return reply.code(403).send({
        message: "No tienes permiso"
      })

    }

  }

}