import { Link } from "@trussworks/react-uswds";
import { useRouteError } from "react-router-dom";

// TODO Add automatic redirect set to timer. And a manual 'back to home' button.

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const routeError = error as { statusText?: string; message?: string };

  return (
    <div id="error-page">
      <h1>Standard error page, redirecting...</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{routeError.statusText || routeError.message}</i>
      </p>
      <Link variant="nav" href={'/'}>Return to Home</Link>,
    </div>
  );
}