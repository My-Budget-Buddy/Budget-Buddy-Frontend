import type { User } from "../../types/models";

import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { updateUserPassword } from "../../api/taxesAPI";
import { Alert, Button, Form, Icon, InputGroup, InputSuffix, Label, ModalHeading, TextInput } from "@trussworks/react-uswds";
import { URL_updateUser } from "../../api/services/UserService";

const Profile: React.FC = () => {
    const { t } = useTranslation();
    const { jwt, profile, setProfile, logout } = useAuthentication();

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<boolean | string>('')

    const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()

        if (!profile) return; // profile should exist if the user is authenticated

        const { id, email } = profile;

        try {
            //@ts-expect-error elements aren't typed
            const confirmPassword = evt.currentTarget.elements["confirm-password"].value;
            const fields = {
                username: profile.email,
                //@ts-expect-error elements aren't typed
                password: evt.currentTarget.elements["new-password"].value,
                //@ts-expect-error elements aren't typed
                firstName: evt.currentTarget.elements["firstName"].value,
                //@ts-expect-error elements aren't typed
                lastName: evt.currentTarget.elements["lastName"].value
            };

            // extract the first and last name fields, put the rest in an object called updatePasswordFields
            const { firstName, lastName, ...updatePasswordFields } = fields;


            // update the user Profile only if changes were made
            if (firstName !== profile.firstName || lastName !== profile.lastName) {
                fetch(URL_updateUser, {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ id, email, firstName, lastName })
                }).then((res) => {
                    if (res.ok) return res.json().then((user: User) => setProfile(user))
                    else console.log(`[profile -- updateProfile]: error updating profile (status = ${res.status})`)
                }).catch((error) => console.log(`[profile -- updateProfile]: error => ${error}`))
            }

            if (confirmPassword === fields.password && confirmPassword !== '') {
                updateUserPassword(updatePasswordFields)
                evt.currentTarget.reset()
                setPasswordError(false)
            } else if (confirmPassword !== fields.password) {
                setPasswordError(true)
                return
            } else {
                return
            }
        } catch (error) {
            console.log("There was an error updating profile infromation: ", error)
        }
    }


    return (
        <div className="flex w-full justify-center h-[80vh] overflow-y-auto">
            <Form onSubmit={handleSubmit} className="w-9/12">
                <ModalHeading> {t("nav.profile")}
                    <Label htmlFor="firstName" >{t("nav.first-name")}</Label>
                    <TextInput
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="first-name"
                        defaultValue={profile?.firstName ?? undefined}
                    />
                    <Label htmlFor="lastName">{t("nav.last-name")}</Label>
                    <TextInput
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="last-name"
                        defaultValue={profile?.lastName ?? undefined}
                    />
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <TextInput
                        id="email"
                        name="email"
                        type="text"
                        autoComplete="email"
                        defaultValue={profile?.email}
                        disabled
                    />
                    {passwordError === false && <Alert type="success" heading="Success" headingLevel="h4">
                        Password has been updated
                    </Alert>}
                    {passwordError === true && <Alert type="error" heading="Error updating password" headingLevel="h4">
                        Passwords do not match
                    </Alert>}
                    <Label htmlFor="new-password">{t("nav.new-password")}</Label>
                    <InputGroup className="unstyled-input-group">
                        <TextInput
                            id="new-password"
                            name="new-password"
                            type={showNewPassword ? "text" : "password"}
                        />
                        <InputSuffix onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <Icon.VisibilityOff data-testid="show-password-vis-off" /> : <Icon.Visibility data-testid="show-password-vis-on" />}
                        </InputSuffix>
                    </InputGroup >
                    <Label htmlFor="confirm-password">{t("nav.confirm-password")}</Label>
                    <InputGroup className="unstyled-input-group">
                        <TextInput id="confirm-password" name="confirm-password" type={showConfirmPassword ? "text" : "password"} />
                        <InputSuffix onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <Icon.VisibilityOff data-testid="confirm-password-vis-off" /> : <Icon.Visibility data-testid="confirm-password-vis-on" />}
                        </InputSuffix>
                    </InputGroup>
                    <Button type="submit" >{t("nav.save")}</Button>

                </ModalHeading>
                <Button type="button" secondary onClick={() => logout()}>{t("auth.logout")}</Button>
            </Form>
        </div>
    );
}

export default Profile;
