import { Grid, Form, Alert, Label, Button, Fieldset, TextInput, GridContainer } from "@trussworks/react-uswds";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../util/redux/authSlice";

const Login: React.FC = () => {
    const { t } = useTranslation();
    const { jwt, loading, setJwt } = useAuthentication();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const fields = {
            // @ts-expect-error untyped form elements
            username: e.currentTarget.elements.email.value,
            // @ts-expect-error untyped form elements
            password: e.currentTarget.elements.password.value
        };

        const res = await fetch("https://api.skillstorm-congo.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fields),
            credentials: "include"
        });

        if (res.ok) {
            const data = await res.json();

            setJwt(data.jwt);
            dispatch(setAuthenticated(true));
        } else {
            if (res.headers.get("content-type")?.includes("text/plain")) {
                setError(await res.text());
            } else setError("Unknown Error");
        }

        return;
    };

    // navigate to dashboard if jwt exists
    if (jwt && !loading) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <main className="bg-gray-200 padding-y-8 ">
            <GridContainer className="usa-section">
                <Grid row className="flex-justify-center margin-bottom-205">
                    <Grid col={12} tablet={{ col: 8 }} desktop={{ col: 6 }}>
                        {error && (
                            <Alert type="error" heading="Error Logging In" headingLevel="h4">
                                {error}
                            </Alert>
                        )}
                    </Grid>
                </Grid>

                <Grid row className="flex-justify-center">
                    <Grid col={12} tablet={{ col: 8 }} desktop={{ col: 6 }}>
                        <div className="bg-white padding-y-3 padding-x-5 border border-base-lightest shadow-lg rounded-lg margin-bottom-4">
                            <h1 className="margin-bottom-0">{t("auth.login")}</h1>
                            <Form onSubmit={handleSubmit} className="min-w-full">
                                <Fieldset legend={t("auth.login-desc")} legendStyle="default">
                                    <Label htmlFor="email">{t("auth.email")}</Label>
                                    <TextInput id="email" name="email" type="text" autoComplete="email" required />

                                    <Label htmlFor="password">{t("auth.password")}</Label>
                                    <TextInput
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        title="Toggle Password Visibility"
                                        className="usa-show-password"
                                        aria-controls="password"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? t("auth.hide") : t("auth.show")}
                                    </button>

                                    <Button type="submit" className="width-full margin-top-3">
                                        {t("auth.login")}
                                    </Button>
                                </Fieldset>
                            </Form>

                            <div className="flex justify-center items-center my-8">
                                <div className="border-t-[1px] border-[#dfe1e2] w-full" />
                                <p className="px-3 text-neutral-400">OR</p>
                                <div className="border-t-[1px] border-[#dfe1e2] w-full" />
                            </div>

                            <Button
                                type="button"
                                outline
                                className="width-full"
                                onClick={() =>
                                    window.location.replace("https://api.skillstorm-congo.com/auth/login/oauth2")
                                }
                            >
                                {t("auth.google")}
                            </Button>
                        </div>

                        <p className="text-center">
                            {t("auth.to-register")}{" "}
                            <Link to="/register" className="usa-link">
                                {t("auth.register")}
                            </Link>
                        </p>
                    </Grid>
                </Grid>
            </GridContainer>
        </main>
    );
};

export default Login;
