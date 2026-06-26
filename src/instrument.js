const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://6c77cf2025c6a152a372b69a2f6ad18e@o4511630756020224.ingest.de.sentry.io/4511630759231568",
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});
