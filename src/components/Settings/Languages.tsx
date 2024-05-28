import { ModalHeading, Radio } from "@trussworks/react-uswds";
import { useTranslation } from "react-i18next";
import { Dispatch, SetStateAction, useState } from "react";

interface LanguageType{
    setSideNav: Dispatch<SetStateAction<string>>
}

const Languages: React.FC<LanguageType> = ({setSideNav}) => {
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [currLang, setCurrLang] = useState(i18n.language);


    return ( 
        <>
            <div className="flex w-full justify-center">
                <ModalHeading className="w-9/12">
                    {t("nav.languages")}
                    <Radio 
                        className="mt-8"
                        id="english" 
                        name="language" 
                        label="English" 
                        checked={currLang === "en"}
                        onChange={() => {
                            i18n.changeLanguage("en")
                            setCurrLang('en')
                            setSideNav(t('nav.languages'))
                        }}
                    />
                    <Radio 
                        id="spanish" 
                        name="language" 
                        label="Español" 
                        checked={currLang === "es"}
                        onChange={() => {
                            i18n.changeLanguage("es")
                            setCurrLang('es')
                            setSideNav(t('nav.languages'))
                        }}
                    />
                </ModalHeading>
            </div>
        </>
    );
}
 
export default Languages;
