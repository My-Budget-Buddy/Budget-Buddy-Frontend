import { Button, Form, Icon, InputGroup, InputSuffix, Label, ModalHeading, TextInput } from "@trussworks/react-uswds";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Profile = () => {
    const { t } = useTranslation();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return ( 
        <div className="flex w-full justify-center h-[80vh] overflow-y-auto">
            <Form onSubmit={() => {}} className="w-9/12">
                <ModalHeading> {t("nav.profile")}
                    <Label htmlFor="first-name" >{t("nav.first-name")}</Label>
                    <TextInput
                        id="first-name"
                        name="first-name"
                        type="text"
                        autoComplete="first-name"
                    />
                    <Label htmlFor="last-name">{t("nav.last-name")}</Label>
                    <TextInput
                        id="last-name"
                        name="last-name"
                        type="text"
                        autoComplete="last-name"
                    />
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <TextInput id="email" name="email" type="text" autoComplete="email" disabled />

                    <Label htmlFor="new-password">{t("nav.new-password")}</Label>
                    <InputGroup>
                        <TextInput id="new-password" name="new-password" type={showNewPassword ? "text" : "password"} />
                        <InputSuffix onClick={()=> setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <Icon.VisibilityOff /> : <Icon.Visibility/>}
                        </InputSuffix>
                    </InputGroup>
                    <Label htmlFor="confirm-password">{t("nav.confirm-password")}</Label>
                    <InputGroup>
                        <TextInput id="confirm-password" name="confirm-password" type={showConfirmPassword ? "text" : "password"} />
                        <InputSuffix onClick={()=> setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <Icon.VisibilityOff/> : <Icon.Visibility/>}
                        </InputSuffix>
                    </InputGroup>
                    <Button type="submit">{t("nav.save")}</Button>
                
                </ModalHeading>
            </Form>
        </div>
    );
}
 
export default Profile;
