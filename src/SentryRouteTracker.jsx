import * as Sentry from "@sentry/react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function SentryRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    Sentry.setTag("page", location.pathname);
  }, [location]);

  return null;
}

export default SentryRouteTracker;
