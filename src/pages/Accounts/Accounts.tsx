import { Accordion, Grid, GridContainer, Icon } from "@trussworks/react-uswds";

import AccountModal from "./AccountModal";
import { useState } from "react";

const Accounts: React.FC = () => {
    const [showTooltip, setShowTooltip] = useState(false);

    function handleDelete(): void {
        throw new Error("Function not implemented.");
    }

    function handleEdit(): void {
        throw new Error("Function not implemented.");
    }

    return (
        <>
            <h1>Accounts</h1>
            <div className="flex justify-end">
                <AccountModal />
            </div>

            <div className="py-5">
                <Accordion
                    bordered={false}
                    multiselectable={true}
                    items={[
                        {
                            title: (
                                <div className="flex justify-between">
                                    <p>
                                        <Icon.AccountBalance /> Checking
                                    </p>
                                </div>
                            ),
                            content: (
                                <div>
                                    <GridContainer>
                                        <Grid row>
                                            <Grid
                                                tablet={{
                                                    col: 2,
                                                }}
                                            >
                                                {<p>TD Bank</p>}
                                            </Grid>
                                            <Grid
                                                className="flex justify-start"
                                                tablet={{
                                                    col: 4,
                                                }}
                                            >
                                                {<p>0001</p>}
                                            </Grid>
                                            <Grid
                                                className="flex justify-end"
                                                tablet={{
                                                    col: 4,
                                                }}
                                            >
                                                {<p>$5,000</p>}
                                            </Grid>
                                            <Grid
                                                className="flex justify-end"
                                                tablet={{
                                                    col: 2,
                                                }}
                                            >
                                                {<p>
                                                    <button className="px-2" onClick={() => handleEdit()}>
                                                    <Icon.Edit />
                                                    </button>
                                                    <button onClick={() => handleDelete()}>
                                                        <Icon.Delete />
                                                    </button>
                                                </p>}
                                            </Grid>
                                        </Grid>
                                    </GridContainer>
                                </div>
                            ),
                            expanded: false,
                            id: "Checking",
                            headingLevel: "h4",
                        },
                        {
                            title: (
                                <div className="flex justify-between">
                                    <p>
                                        <Icon.CreditCard /> Credit Cards
                                    </p>
                                </div>
                            ),
                            content: (
                                <div>
                                    <GridContainer>
                                        <Grid row>
                                            <Grid

                                                tablet={{
                                                    col: 2,
                                                }}
                                            >
                                                {<p>Visa</p>}
                                            </Grid>
                                            <Grid
                                                className="flex justify-start"
                                                tablet={{
                                                    col: 4,
                                                }}
                                            >
                                                {<p>5000</p>}
                                            </Grid>
                                            <Grid
                                                className="flex justify-end"
                                                tablet={{
                                                    col: 4,
                                                }}
                                            >
                                                {<p>$2,310</p>}
                                            </Grid>
                                            <Grid
                                                className="flex justify-end"
                                                tablet={{
                                                    col: 2,
                                                }}
                                            >
                                                {<p>
                                                    <button className="px-2" onClick={() => handleEdit()}>
                                                    <Icon.Edit />
                                                    </button>
                                                    <button onClick={() => handleDelete()}>
                                                        <Icon.Delete />
                                                    </button>
                                                </p>}
                                            </Grid>
                                        </Grid>
                                    </GridContainer>
                                </div>
                            ),
                            expanded: false,
                            id: "credit-cards",
                            headingLevel: "h4",
                        },
                        {
                            title: (
                                <div className="flex justify-between">
                                    <p>
                                        <Icon.AccountBalance /> Savings
                                    </p>
                                </div>
                            ),
                            content: (
                                <div>
                                    <GridContainer>
                                        <Grid row>
                                            <Grid
                                                tablet={{
                                                    col: 2,
                                                }}
                                            >
                                                {<p>TD Bank</p>}
                                            </Grid>
                                            <Grid
                                                className="flex justify-start"
                                                tablet={{
                                                    col: 4,
                                                }}
                                            >
                                                {<p>0009</p>}
                                            </Grid>
                                            <Grid
                                                className="flex justify-end"
                                                tablet={{
                                                    col: 4,
                                                }}
                                            >
                                                {<p>$10,000</p>}
                                            </Grid>
                                            <Grid
                                                className="flex justify-end"
                                                tablet={{
                                                    col: 2,
                                                }}
                                            >
                                                {<p>
                                                    <button className="px-2" onClick={() => handleEdit()}>
                                                    <Icon.Edit />
                                                    </button>
                                                    <button onClick={() => handleDelete()}>
                                                        <Icon.Delete />
                                                    </button>
                                                </p>}
                                            </Grid>
                                        </Grid>
                                    </GridContainer>
                                </div>
                            ),
                            expanded: false,
                            id: "savings",
                            headingLevel: "h4",
                        },
                        {
                            title: (
                                <div className="flex justify-between">
                                    <p>
                                        <Icon.AccountBalance /> investments
                                    </p>
                                </div>
                            ),
                            content: (
                                <div>
                                    <GridContainer>
                                        <Grid row>
                                            <Grid
                                                tablet={{
                                                    col: 2,
                                                }}
                                            >
                                                {<p>Stocks</p>}
                                            </Grid>
                                            <Grid
                                                className="flex justify-start"
                                                tablet={{
                                                    col: 4,
                                                }}
                                            >
                                                {<p>0060</p>}
                                            </Grid>
                                            <Grid
                                                className="flex justify-end"
                                                tablet={{
                                                    col: 4,
                                                }}
                                            >
                                                {<p>$2,000</p>}
                                            </Grid>
                                            <Grid
                                                className="flex justify-end"
                                                tablet={{
                                                    col: 2,
                                                }}
                                            >
                                                {<p>
                                                    <button className="px-2" onClick={() => handleEdit()}>
                                                    <Icon.Edit />
                                                    </button>
                                                    <button onClick={() => handleDelete()}>
                                                        <Icon.Delete />
                                                    </button>
                                                </p>}
                                            </Grid>
                                        </Grid>
                                    </GridContainer>
                                </div>
                            ),
                            expanded: false,
                            id: "investments",
                            headingLevel: "h4",
                        },
                    ]}
                />
                <div className="py-4">
                    <h1>Insights</h1>
                    <div className="flex items-center">
                        <h2 className="mr-2">Net Cash</h2>
                        <span
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className="relative"
                        >
                            <Icon.Help />
                            {/* Render tooltip conditionally */}
                            {showTooltip && (
                                <div className="absolute left-8 top-0 bg-gray-200 p-2 rounded shadow-md w-48">
                                    Net Cash is all debits subtracted by credits.
                                </div>
                            )}
                        </span>
                    </div>
                    <div className="py-5">
                        <p>$17,000 - $2,310 = $14,690</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Accounts;
