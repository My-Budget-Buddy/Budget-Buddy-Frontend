import { Link } from "@trussworks/react-uswds";
import { NavLink, useRouteError } from "react-router-dom";
import { Grid, GridContainer, Icon } from "@trussworks/react-uswds";

const Error = () => {
    const error = useRouteError();
    console.error(error);

    const routeError = error as { status?: number; statusText?: string; message?: string };

    return (
        <div className="usa-section bg-blue-950" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <GridContainer>
                <Grid row gap>
                    <Grid className="flex-justify-center">
                        <div className="bg-white shadow-lg rounded-lg padding-5 text-center" style={{ maxWidth: '600px', width: '100%' }}>
                            <Icon.Error size={4} className="text-secondary margin-bottom-2" />
                            <h1 id="error-page-header" className="text-primary font-heading-xl margin-bottom-1">Page not found</h1>
                            <p className="usa-intro margin-top-1 text-base-dark">
                                We’re sorry, we can’t find the page you're looking for. It might have been removed, changed its name, or is otherwise unavailable.
                            </p>
                            <p className="margin-top-2 text-base-dark">
                                If you typed the URL directly, check your spelling and capitalization. Our URLs look like this:
                                <strong>{' <agency.gov/example-one>'}</strong>.
                            </p>
                            <p className="margin-top-2 text-base-dark">
                                Visit our homepage for helpful tools and resources, or contact us and we’ll point you in the right direction.
                            </p>
                            <div className="margin-y-5">
                                <NavLink id="Return-to-homepage" to="/" className="usa-button">
                                    Return to homepage
                                </NavLink>

                            </div>
                            <p className="text-base-dark">For immediate assistance:</p>
                            <ul className="usa-list text-base-dark">
                                <li>
                                    <Link href="javascript:void()">Start a live chat with us</Link>
                                </li>
                                <li>
                                    Call <Link href="javascript:void()"> (555) 555-GOVT</Link>
                                </li>
                            </ul>
                            <p className="text-base margin-top-4 text-base-dark">
                                <strong>Error code:</strong> {routeError.status || "Unknown"}
                            </p>
                            <p className="text-base text-base-dark">
                                <strong>Error message:</strong> {routeError.statusText || routeError.message || "An unexpected error has occurred."}
                            </p>
                        </div>
                    </Grid>
                </Grid>
            </GridContainer>
        </div>
    );
};

export default Error;
