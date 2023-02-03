import { hashPassword } from "../../../utilities/credential.js";

export const updateUserHandler = async function (request, reply) {
  try {
    //Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info(
        "Admin API: The request's type is not set to Users, update failed"
      );
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    //Check if the user exists in the database
    const userStmt = this.db.prepare("SELECT * FROM users WHERE uuid = ?;");
    const user = await userStmt.get(request.params.uuid);

    if (!user) {
      request.log.info(
        "Admin API: User does not exist in database, update failed"
      );
      throw { statusCode: 404, message: "User Not Found" };
    }

    //If the user's email is being updated, check if the new email exists already
    if (request.body.data.attributes.email) {
      const stmt = this.db.prepare("SELECT * FROM users WHERE email = ?;");
      const duplicateAccount = await stmt.get(
        request.body.data.attributes.email
      );

      if (duplicateAccount) {
        request.log.info(
          "Admin API: User's email already exists in database, update failed"
        );
        throw { statusCode: 400, message: "Duplicate Email Address Exists" };
      }
    }

    //if the user's password is being updated, hash the new password
    if (request.body.data.attributes.password) {
      const hashpwd = await hashPassword(request.body.data.attributes.password);
      request.body.data.attributes.password = hashpwd;
    }

    //If a request does not include all of the attributes for a resource, the server MUST interpret the missing attributes as if they were included with their current values. The server MUST NOT interpret missing attributes as null values.
    const updateStmt = this.db.prepare(
      "UPDATE users SET name = coalesce(?, name), email = coalesce(?, email), password = coalesce(?, password), updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE uuid = ? RETURNING uuid, name, email, created_at, updated_at;"
    );
    const updatedUser = updateStmt.get(
      request.body.data.attributes.name,
      request.body.data.attributes.email,
      request.body.data.attributes.password,
      request.params.uuid
    );

    //Prepare the server response
    const userAttributes = {
      name: updatedUser.name,
      email: updatedUser.email,
      created: updatedUser.created_at,
    };

    reply.statusCode = 200;

    //Send the server reply
    return {
      data: {
        type: "users",
        id: updatedUser.uuid,
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
