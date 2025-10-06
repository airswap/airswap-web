import * as Sentry from "@sentry/react";

import { createBrowserHistory } from "history";

const history = createBrowserHistory();

Sentry.init({
  dsn: "https://76b39e9e4a5ab1c3b2dddc14ac9638e3@o4508927143444480.ingest.us.sentry.io/4508927145213952",
  integrations: [Sentry.reactRouterV5BrowserTracingIntegration({ history })],
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",
  debug: false,
});
