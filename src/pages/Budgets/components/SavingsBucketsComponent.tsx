import { useTranslation } from "react-i18next";
import SavingsBucketTable from "./subComponents/SavingsBucketsTable";

function SavingsBucketComponent() {
    const { t } = useTranslation();

    return (
        <>
            <h1 className="font-bold mr-4">{t("budgets.savings-bucket")}</h1>
            <SavingsBucketTable />
        </>
    );
}

export default SavingsBucketComponent;
