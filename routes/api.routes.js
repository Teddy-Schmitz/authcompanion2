import { registrationHandler } from "../services/auth/registration.js";
import { registrationSchema } from "../services/auth/schemas/registrationSchema.js";

import { loginSchema } from "../services/auth/schemas/loginSchema.js";
import { loginHandler } from "../services/auth/login.js";

import { userProfileSchema } from "../services/auth/schemas/userProfileSchema.js";
import { userProfileHandler } from "../services/auth/profile.js";

import { profileRecoverySchema } from "../services/auth/schemas/profileRecoverySchema.js";
import { profileRecoveryHandler } from "../services/auth/recovery.js";

import { tokenRefreshHandler } from "../services/auth/refresh.js";
import { refreshSchema } from "../services/auth/schemas/refreshSchema.js";

import { registrationOptionsHandler } from "../services/webAuthn/registrationOptions.js";
import { registrationVerificationHandler } from "../services/webAuthn/registrationVerification.js";
import { loginOptionsHandler } from "../services/webAuthn/loginOptions.js";
import { loginVerificationHandler } from "../services/webAuthn/loginVerification.js";

import { authenticateRequest } from "../utilities/authenticate.js";

const serverRoutes = async function (fastify, options) {
  
  //authentication API routes
  fastify.post("/register", registrationSchema, registrationHandler);
  fastify.post("/login", loginSchema, loginHandler);
  fastify.post(
    "/users/me",
    { onRequest: [authenticateRequest], ...userProfileSchema },
    userProfileHandler
  );
  fastify.post("/recovery", profileRecoverySchema, profileRecoveryHandler);
  fastify.post("/refresh", refreshSchema, tokenRefreshHandler);

  //webAuthn API routes
  fastify.get("/registration-options", registrationOptionsHandler);
  fastify.post("/registration-verification", registrationVerificationHandler);
  fastify.get("/login-options", loginOptionsHandler);
  fastify.post("/login-verification", loginVerificationHandler);

  //admin API routes

};

export default serverRoutes;
