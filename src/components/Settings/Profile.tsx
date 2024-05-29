import { Button, Form, Icon, InputGroup, InputSuffix, Label, ModalHeading, TextInput } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateUserInfo, updateUserPassword } from "../../pages/Tax/taxesAPI";

interface ProfileType {
    firstName: string;
    lastName: string;
    email: string;
    id: number;
}

type SetProfileType = (profile: ProfileType) => void;

type FetchUserInfoType = () => Promise<void>;

interface ProfileProps {
    profile: ProfileType;
    setProfile: SetProfileType;
    fetchUserInfo: FetchUserInfoType;
}

const Profile : React.FC<ProfileProps> = ({ profile, setProfile, fetchUserInfo })=> {
    const { t } = useTranslation();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // get profile infomration
    useEffect(()=> {
        fetchUserInfo()
    }, [])

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        evt.preventDefault();
        const { name, value } = evt.target;
        setProfile({...profile, [name]: value})
    }

    const handleSubmit = (evt: any) => {
        evt.preventDefault()
        try {
            updateUserInfo(profile)
            const confirmPassword = evt.currentTarget.elements["confirm-password"].value;
            //if a password was input 
            const fields = {
                username: profile.email,
                password: evt.currentTarget.elements["new-password"].value
            };
            if (confirmPassword === fields.password){
                updateUserPassword(fields)
                evt.currentTarget.reset()
            }else{
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
                        value={profile.firstName}
                        onChange={handleChange}
                    />
                    <Label htmlFor="lastName">{t("nav.last-name")}</Label>
                    <TextInput
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="last-name"
                        value={profile.lastName}
                        onChange={handleChange}
                    />
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <TextInput 
                        id="email" 
                        name="email" 
                        type="text" 
                        autoComplete="email"
                        value={profile.email}
                        disabled 
                    />

                    <Label htmlFor="new-password">{t("nav.new-password")}</Label>
                    <InputGroup>
                        <TextInput 
                            id="new-password" 
                            name="new-password" 
                            type={showNewPassword ? "text" : "password"}
                        />
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
                    <Button type="submit" >{t("nav.save")}</Button>
                
                </ModalHeading>
            </Form>
        </div>
    );
}
 
export default Profile;
