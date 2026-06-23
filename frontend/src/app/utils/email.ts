import nodemailer from "nodemailer";
import { getEnvValue } from "@/lib/env";

interface EmailConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  from: string;
  defaultTo: string;
  to: string;
}

export function escapeHtml(value: string | number | boolean | undefined) {
  return value
    ?.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;") ?? "";
}

export function getEmailConfig(): EmailConfig {
  const user = getEnvValue("ZOHO_SMTP_USER") || getEnvValue("EMAIL_USER");
  const password =
    getEnvValue("ZOHO_SMTP_PASSWORD") || getEnvValue("EMAIL_PASSWORD");
  const host = getEnvValue("ZOHO_SMTP_HOST") || "smtp.zoho.com";
  const port = Number(getEnvValue("ZOHO_SMTP_PORT") || 465);
  const from = getEnvValue("ZOHO_DEFAULT_FROM") || user;
  const defaultTo = getEnvValue("ZOHO_DEFAULT_TO") || getEnvValue("EMAIL_TO");

  const missingKeys = [
    ["ZOHO_SMTP_USER", user],
    ["ZOHO_SMTP_PASSWORD", password],
    ["ZOHO_DEFAULT_TO", defaultTo],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required email environment variables: ${missingKeys.join(", ")}`
    );
  }

  if (!user || !password || !host || !port || !from || !defaultTo) {
    throw new Error("Email configuration is incomplete");
  }

  return {
    user,
    password,
    host,
    port,
    from,
    defaultTo,
    to: defaultTo,
  };
}

export function createEmailTransporter(config: EmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });
}
