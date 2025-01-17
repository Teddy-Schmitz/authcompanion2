import * as dotenv from "dotenv";
dotenv.config();

const config = {
  AUTHPORT: process.env.PORT || "3002",
  ORIGIN: process.env.ORIGIN || "http://localhost:3002",
  APPLICATIONORIGIN:
    process.env.APPLICATION_ORIGIN || "http://localhost:3002/v1/web/home",
  ADMINORIGIN:
    process.env.ADMIN_ORIGIN || "http://localhost:3002/v1/admin/dashboard",
  DBPATH: process.env.DB_PATH || "./authcompanion_users.db",
  KEYPATH: process.env.SERVER_KEY_PATH || "./serverkey",
  ADMINKEYPATH: process.env.ADMIN_KEY_PATH || "./adminkey",
  RECOVERYURL:
    process.env.RECOVERY_REDIRECT_URL || "http://localhost:3002/v1/web/profile",
  SMTPHOSTNAME: process.env.SMTP_HOSTNAME || "",
  SMTPPORT: process.env.SMTP_PORT || "2525",
  SMTPUSER: process.env.SMTP_USERNAME || "",
  SMTPPASSWORD: process.env.SMTP_PASSWORD || "",
  FROMADDRESS: process.env.FROM_ADDRESS || "no_reply@example.com",
};

export default config;
