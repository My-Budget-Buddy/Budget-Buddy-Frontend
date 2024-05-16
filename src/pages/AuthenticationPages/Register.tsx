import {
  Grid,
  Form,
  Alert,
  Label,
  Button,
  Fieldset,
  TextInput,
  GridContainer,
} from "@trussworks/react-uswds";
import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

const Register: React.FC = () => {
  const { t } = useTranslation();

  const [error] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // @ts-expect-error untyped form elements
    const confirmPassword = e.currentTarget.elements["confirm-password"].value;

    const fields = {
      // @ts-expect-error untyped form elements
      username: e.currentTarget.elements.username.value,
      // @ts-expect-error untyped form elements
      password: e.currentTarget.elements.password.value,
    };

    if (confirmPassword !== fields.password)
      console.log("passwords do not match");

    return;
  };

  return (
    <main>
      <div className="bg-base-lightest">
        <GridContainer className="usa-section">
          {/* Error Alert */}
          <Grid row className="flex-justify-center margin-bottom-205">
            <Grid col={12} tablet={{ col: 8 }} desktop={{ col: 6 }}>
              {error && (
                <Alert
                  type="error"
                  heading="Error Logging In"
                  headingLevel="h4"
                >
                  {error}
                </Alert>
              )}
            </Grid>
          </Grid>

          {/* Main Form Content */}
          <Grid row className="flex-justify-center">
            <Grid col={12} tablet={{ col: 8 }} desktop={{ col: 6 }}>
              <div className="bg-white padding-y-3 padding-x-5 border border-base-lightest margin-bottom-4">
                <h1 className="margin-bottom-0">{t("auth.register")}</h1>
                <Form onSubmit={handleSubmit} className="min-w-full">
                  <Fieldset
                    legend={t("auth.register-desc")}
                    legendStyle="default"
                  >
                    <Label htmlFor="username">{t("auth.username")}</Label>
                    <TextInput
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                    />

                    <Label htmlFor="password">{t("auth.new-password")}</Label>
                    <TextInput
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                    />
                    <Label htmlFor="confirm-password">
                      {t("auth.confirm-password")}
                    </Label>
                    <TextInput
                      id="confirm-password"
                      name="confirm-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      title="Toggle Password Visibility"
                      className="usa-show-password"
                      aria-controls="password"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? t("auth.show") : t("auth.hide")}
                    </button>

                    <Button type="submit">{t("auth.register")}</Button>
                  </Fieldset>
                </Form>

                <div className="border-top border-base-lighter margin-top-4 padding-top-4">
                  <Button type="button" outline className="width-full">
                    {t("auth.google")}
                  </Button>
                </div>
              </div>

              <p className="text-center">
                {t("auth.to-login")}{" "}
                <Link to="/login" className="usa-link">
                  {t("auth.login")}
                </Link>
              </p>
            </Grid>
          </Grid>
        </GridContainer>
      </div>
    </main>
  );
};

export default Register;
