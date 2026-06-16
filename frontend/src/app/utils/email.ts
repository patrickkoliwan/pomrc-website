import nodemailer from "nodemailer";

interface EmailConfig {
  user: string;
  password: string;
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
  const user = process.env.EMAIL_USER;
  const password = process.env.EMAIL_PASSWORD;
  const to = process.env.EMAIL_TO;

  const missingKeys = [
    ["EMAIL_USER", user],
    ["EMAIL_PASSWORD", password],
    ["EMAIL_TO", to],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required email environment variables: ${missingKeys.join(", ")}`
    );
  }

  if (!user || !password || !to) {
    throw new Error("Email configuration is incomplete");
  }

  return {
    user,
    password,
    to,
  };
}

export function createEmailTransporter(config: EmailConfig) {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.user,
      pass: config.password,
    },
  });
}
