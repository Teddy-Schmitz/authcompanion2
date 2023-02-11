import { createUserHandler } from "../services/admin/users/create.js";
import { createSchema } from "../services/admin/users/schema/createSchema.js";

import { listUsersHandler } from "../services/admin/users/list.js";

import { deleteUserHandler } from "../services/admin/users/delete.js";

import { updateUserHandler } from "../services/admin/users/update.js";
import { updateSchema } from "../services/admin/users/schema/updateSchema.js";

import { authenticateRequest } from "../utilities/authenticate.js";

const adminRoutes = async function (fastify, options) {
  //admin API routes
  fastify.post(
    "/users",
    { onRequest: [authenticateRequest], ...createSchema },
    createUserHandler
  );
  fastify.get("/users", { onRequest: [authenticateRequest] }, listUsersHandler);
  fastify.delete(
    "/users/:uuid",
    { onRequest: [authenticateRequest] },
    deleteUserHandler
  );
  fastify.patch(
    "/users/:uuid",
    { onRequest: [authenticateRequest], ...updateSchema },
    updateUserHandler
  );
};

export default adminRoutes;
