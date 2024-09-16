import { Grid, Form, Alert, Label, Button, Fieldset, TextInput, GridContainer, Title } from "@trussworks/react-uswds";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthentication } from "../../contexts/AuthenticationContext";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { jwt, loading } = useAuthentication();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // @ts-expect-error untyped form elements
        const confirmPassword = e.currentTarget.elements["confirm-password"].value;

        const fields = {
            // @ts-expect-error untyped form elements
            username: e.currentTarget.elements.email.value,
            // @ts-expect-error untyped form elements
            password: e.currentTarget.elements.password.value
        };

        if (confirmPassword !== fields.password) {
            return;
        }

        const res = await fetch("http://localhost:8125/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fields)
        });

        if (res.ok) {
            navigate("/login");
        } else {
            if (res.headers.get("content-type")?.includes("text/plain")) {
                setError(await res.text());
            } else setError("Unknown error.");
        }
    };

    if (jwt && !loading) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <main className="bg-gray-200 padding-y-8">
            <GridContainer className="usa-section">
                <Grid row className="flex-justify-center margin-bottom-205">
                    <Grid col={12} tablet={{ col: 8 }} desktop={{ col: 6 }}>
                        {error && (
                            <Alert type="error" heading="Error Creating Account" headingLevel="h4">
                                {error}
                            </Alert>
                        )}
                    </Grid>
                </Grid>

                <Grid row className="flex-justify-center">
                    <Grid col={12} tablet={{ col: 8 }} desktop={{ col: 6 }}>
                        <div className="bg-white padding-y-3 padding-x-5 border border-base-lightest shadow-lg rounded-lg margin-bottom-4">
                            <Title className="margin-bottom-0">{t("auth.register")}</Title>
                            <Form onSubmit={handleSubmit} className="min-w-full">
                                <Fieldset legend={t("auth.register-desc")} legendStyle="default">
                                    <Label htmlFor="email">{t("auth.email")}</Label>
                                    <TextInput id="email" name="email" type="email" autoComplete="email" required />

                                    <Label htmlFor="password">{t("auth.new-password")}</Label>
                                    <TextInput
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                    />
                                    <Label htmlFor="confirm-password">{t("auth.confirm-password")}</Label>
                                    <TextInput
                                        id="confirm-password"
                                        name="confirm-password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        id="show-password"
                                        type="button"
                                        title="Toggle Password Visibility"
                                        className="usa-show-password"
                                        aria-controls="password"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? t("auth.hide") : t("auth.show")}
                                    </button>

                                    <Button id="create-account" type="submit" className="width-full margin-top-3">
                                        {t("auth.register")}
                                    </Button>
                                </Fieldset>
                            </Form>

                            <div className="flex justify-center items-center my-8">
                                <div className="border-t-[1px] border-[#dfe1e2] w-full" />
                                <p className="px-3 text-neutral-400">OR</p>
                                <div className="border-t-[1px] border-[#dfe1e2] w-full" />
                            </div>

                            <Button
                                id="google-sign-in"
                                type="button"
                                outline
                                className="width-full"
                                onClick={() =>
                                    window.location.replace("http://localhost:8125/auth/login/oauth2")
                                }
                            >
                                {t("auth.google")}
                            </Button>
                        </div>

                        <p className="text-center">
                            {t("auth.to-login")}{" "}
                            <Link id="link-login" to="/login" className="usa-link">
                                {t("auth.login")}
                            </Link>
                        </p>
                    </Grid>
                </Grid>
            </GridContainer>
        </main>
    );
};

export default Register;
