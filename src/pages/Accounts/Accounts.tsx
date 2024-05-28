import type { Account } from "../../types/models";

import AccountModal from "./AccountModal";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "../../util/helpers";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { Accordion, Alert, Grid, GridContainer, Icon, Title } from "@trussworks/react-uswds";
import CreditScoreModal from "./CreditScoreModal";
import { getAccountByID } from "../Tax/taxesAPI";
import { useTranslation } from "react-i18next";

const Accounts: React.FC = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<Account[] | null>(null);
    const { t } = useTranslation();

    const handleDelete = (accountId: number): void => {
        fetch(`http://localhost:8080/accounts/1/${accountId}`, {
            method: "DELETE"
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(t("accounts.delete-error"));
                }
                setAccounts((prevAccounts) => prevAccounts?.filter((acc) => acc.id !== accountId) || null);
            })
            .catch((err: Error) => setError(err.message));
    };

    useEffect(() => {
        // TODO: update this to use the users information + the gateway service + headers for Auth
        getAccountByID()
            .then((res) => {
                // if (!res.ok) {
                //     throw new Error(t("accounts.fetch-error"));
                // }
                console.log((res.data));
                return res.data;
            })
            .then((data: Account[]) => setAccounts(data))
            .catch((err: Error) => setError(err.message));
    }, []);

    const handleAccountAdded = (newAccount: Account) => {
        setAccounts((prevAccounts) => (prevAccounts ? [...prevAccounts, newAccount] : [newAccount]));
    };

    // do something here? idk useMemo or useCallback?
    const totalBalance = useMemo(() => {
        if (!accounts) return 0;

        return accounts.filter((acc) => acc.type !== "CREDIT").reduce((sum, acc) => sum + acc.currentBalance, 0);
    }, [accounts]);

    const debts = useMemo(() => {
        if (!accounts) return 0;

        return accounts.filter((acc) => acc.type === "CREDIT").reduce((sum, acc) => sum + acc.currentBalance, 0);
    }, [accounts]);

    const netCash = totalBalance - debts;

    return (
        <>
            <Title>{t("accounts.title")}</Title>

            {error && (
                <Alert type="error" headingLevel="h4">
                    {error}
                </Alert>
            )}
            {/* Net Cash Section */}
            <section className="pb-5 mb-5 border-b border-b-[#dfe1e2]">
                <div className="flex items-center space-x-2 mb-6">
                    <h2 className="text-3xl font-semibold">{t("accounts.net-cash")}</h2>
                    <span
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className="relative"
                    >
                        <Icon.Help />
                        {/* Render tooltip conditionally */}
                        {showTooltip && (
                            <div className="absolute left-8 top-0 bg-gray-200 p-2 rounded shadow-md w-40">
                                {t("accounts.net-desc")}
                            </div>
                        )}
                    </span>
                </div>

                <div className="flex justify-center pt-6">
                    {netCash >= 0 ? (
                        <Gauge
                            width={500}
                            height={200}
                            value={netCash}
                            valueMin={0}
                            valueMax={totalBalance} // max is the total of your assets
                            startAngle={-60}
                            endAngle={60}
                            sx={{
                                [`& .${gaugeClasses.valueText}`]: {
                                    fontSize: "40px", // Adjust the font size // Change the color to blue
                                    fontWeight: "bold", // Make the text bold
                                    transform: "translate(0px, -50px)" // Adjust position if needed
                                },
                                [`& .${gaugeClasses.valueArc}`]: {
                                    fill: "#52b202" // green for gain
                                }
                            }}
                            text={({ value }) => `${formatCurrency(value!)}`}
                        />
                    ) : (
                        <Gauge
                            width={500}
                            height={200}
                            value={-netCash}
                            valueMin={0}
                            valueMax={totalBalance} // max is the total of your assets
                            startAngle={60}
                            endAngle={-60}
                            sx={{
                                [`& .${gaugeClasses.valueText}`]: {
                                    fontSize: "40px", // Adjust the font size // Change the color to blue
                                    fontWeight: "bold", // Make the text bold
                                    transform: "translate(0px, -50px)" // Adjust position if needed
                                },
                                [`& .${gaugeClasses.valueArc}`]: {
                                    fill: "#b20202" // red for loss
                                }
                            }}
                            text={({ value }) => `${formatCurrency(value!)}`}
                        />
                    )}
                </div>

                <div className="flex justify-center">
                    <table className="w-50  divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-r border-gray-600">
                                    {t("accounts.total-assets")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold  uppercase tracking-wider border-gray-600">
                                    {t("accounts.total-debts")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-gray-600">
                                    {formatCurrency(totalBalance, true)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-gray-600">{formatCurrency(debts)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-semibold">{t("accounts.view-accounts")}</h2>
                <AccountModal onAccountAdded={handleAccountAdded} />
            </div>
            <section className="pb-5 mb-5 border-b border-b-[#dfe1e2]">
                <Accordion
                    bordered={false}
                    multiselectable={true}
                    items={[
                        {
                            title: (
                                <div className="flex space-x-2">
                                    <Icon.AccountBalance /> <p>{t("accounts.checking")}</p>
                                </div>
                            ),
                            content: (
                                <GridContainer className="w-full min-w-full">
                                    {accounts &&
                                        accounts
                                            .filter((acc) => acc.type === "CHECKING")
                                            .map((acc) => (
                                                <Grid row key={acc.id}>
                                                    <Grid className="flex justify-start" tablet={{ col: 2 }}>
                                                        {acc.institution}
                                                    </Grid>
                                                    <Grid className="flex justify-start" tablet={{ col: 4 }}>
                                                        {acc.accountNumber}
                                                    </Grid>
                                                    <Grid className="flex justify-end" tablet={{ col: 4 }}>
                                                        {formatCurrency(acc.currentBalance)}
                                                    </Grid>
                                                    <Grid className="flex justify-end" tablet={{ col: 2 }}>
                                                        <button onClick={() => handleDelete(acc.id)}>
                                                            <Icon.Delete />
                                                        </button>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                </GridContainer>
                            ),
                            expanded: false,
                            id: "Checking",
                            headingLevel: "h4"
                        },
                        {
                            title: (
                                <div className="flex space-x-2">
                                    <Icon.CreditCard /> <p>{t("accounts.credit")}</p>
                                </div>
                            ),
                            content: (
                                <GridContainer className="w-full min-w-full">
                                    {accounts &&
                                        accounts
                                            .filter((acc) => acc.type === "CREDIT")
                                            .map((acc) => (
                                                <Grid row key={acc.id}>
                                                    <Grid className="flex justify-start" tablet={{ col: 2 }}>
                                                        {acc.institution}
                                                    </Grid>
                                                    <Grid className="flex justify-start" tablet={{ col: 4 }}>
                                                        {acc.accountNumber}
                                                    </Grid>
                                                    <Grid className="flex justify-end" tablet={{ col: 4 }}>
                                                        {formatCurrency(acc.currentBalance)}
                                                    </Grid>
                                                    <Grid className="flex justify-end" tablet={{ col: 2 }}>
                                                        <button onClick={() => handleDelete(acc.id)}>
                                                            <Icon.Delete />
                                                        </button>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                </GridContainer>
                            ),
                            expanded: false,
                            id: "credit-cards",
                            headingLevel: "h4"
                        },
                        {
                            title: (
                                <div className="flex space-x-2">
                                    <Icon.AccountBalance /> <p>{t("accounts.savings")}</p>
                                </div>
                            ),
                            content: (
                                <GridContainer className="min-w-full w-full">
                                    {accounts &&
                                        accounts
                                            .filter((acc) => acc.type === "SAVINGS")
                                            .map((acc) => (
                                                <Grid row key={acc.id}>
                                                    <Grid className="flex justify-start" tablet={{ col: 2 }}>
                                                        {acc.institution}
                                                    </Grid>
                                                    <Grid className="flex justify-start" tablet={{ col: 4 }}>
                                                        {acc.accountNumber}
                                                    </Grid>
                                                    <Grid className="flex justify-end" tablet={{ col: 4 }}>
                                                        {formatCurrency(acc.currentBalance)}
                                                    </Grid>
                                                    <Grid className="flex justify-end" tablet={{ col: 2 }}>
                                                        <button onClick={() => handleDelete(acc.id)}>
                                                            <Icon.Delete />
                                                        </button>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                </GridContainer>
                            ),
                            expanded: false,
                            id: "savings",
                            headingLevel: "h4"
                        },
                        {
                            title: (
                                <div className="flex space-x-2">
                                    <Icon.AccountBalance /> <p>{t("accounts.investment")}</p>
                                </div>
                            ),
                            content: (
                                <GridContainer className="min-w-full w-full">
                                    {accounts &&
                                        accounts
                                            .filter((acc) => acc.type === "INVESTMENT")
                                            .map((acc) => (
                                                <Grid row key={acc.id}>
                                                    <Grid className="flex justify-start" tablet={{ col: 2 }}>
                                                        {acc.institution}
                                                    </Grid>
                                                    <Grid className="flex justify-start" tablet={{ col: 4 }}>
                                                        {acc.accountNumber}
                                                    </Grid>
                                                    <Grid className="flex justify-end" tablet={{ col: 4 }}>
                                                        {formatCurrency(acc.currentBalance)}
                                                    </Grid>
                                                    <Grid className="flex justify-end" tablet={{ col: 2 }}>
                                                        <button onClick={() => handleDelete(acc.id)}>
                                                            <Icon.Delete />
                                                        </button>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                </GridContainer>
                            ),
                            expanded: false,
                            id: "investments",
                            headingLevel: "h4"
                        }
                    ]}
                />
            </section>
            <section className="pb-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-semibold">{t("accounts.view-credit-score")}</h2>
                    <CreditScoreModal totalDebt={debts} />

                </div>
                <div className="flex justify-center py-5">
                    <table className="table-auto w-full divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-m font-bold uppercase tracking-wider border-r border-gray-600 text-red-500">
                                    {t("accounts.bad")}
                                </th>
                                <th className="px-6 py-3 text-left text-m font-bold  uppercase tracking-wider border-r border-gray-600 text-yellow-500">
                                    {t("accounts.fair")}
                                </th>
                                <th className="px-6 py-3 text-left text-m font-bold  uppercase tracking-wider border-r border-gray-600 text-green-500">
                                    {t("accounts.good")}
                                </th>
                                <th className="px-6 py-3 text-left text-m font-bold  uppercase tracking-wider border-gray-600 text-green-900">
                                    {t("accounts.excellent")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 border-r border-gray-600">
                                    <p><span className="font-bold">300-629 </span>{t("accounts.bad-desc")}</p>
                                </td>
                                <td className="px-6 py-4 border-r border-gray-600">
                                    <p><span className="font-bold">630-689 </span>{t("accounts.fair-desc")}</p>
                                </td>
                                <td className="px-6 py-4 border-r border-gray-600">
                                    <p><span className="font-bold">690-719 </span>{t("accounts.good-desc")}</p>
                                </td>
                                <td className="px-6 py-4 border-gray-600">
                                    <p><span className="font-bold">720-850 </span>{t("accounts.excellent-desc")}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
};

export default Accounts;
