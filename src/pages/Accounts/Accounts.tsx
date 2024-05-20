import { Accordion, Grid, GridContainer, Icon } from "@trussworks/react-uswds";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

import AccountModal from "./AccountModal";
import { useState } from "react";
import { green } from "@mui/material/colors";

const Accounts: React.FC = () => {
    const [showTooltip, setShowTooltip] = useState(false);

    function handleDelete(): void {
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
                                    <GridContainer >
                                        <Grid row >
                                            <Grid
                                                className="flex justify-start"
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
                                                className="flex justify-start"
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
                                                className="flex justify-start"
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
                                                className="flex justify-start"
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
                    <div className="flex items-center">
                        <h1 className="mr-2">Net Cash</h1>
                        <span
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className="relative"
                        >
                            <Icon.Help />
                            {/* Render tooltip conditionally */}
                            {showTooltip && (
                                <div className="absolute left-8 top-0 bg-gray-200 p-2 rounded shadow-md w-40">
                                    Net Cash is all debits subtracted by credits.
                                </div>
                            )}
                        </span>
                    </div>
                    <div className="flex justify-center pt-6">
                        <Gauge width={500}
                            height={200}
                            value={14690}
                            valueMin={0}
                            valueMax={17000} // max is the total of your assets
                            startAngle={-60}
                            endAngle={60}
                            sx={{
                                [`& .${gaugeClasses.valueText}`]: {
                                    fontSize: '40px', // Adjust the font size // Change the color to blue
                                    fontWeight: 'bold', // Make the text bold
                                    transform: 'translate(0px, -50px)', // Adjust position if needed
                                },
                                [`& .${gaugeClasses.valueArc}`]: {
                                    fill: '#52b202',
                                },
                            }}
                            text={({ value }) => `${value}`}
                        />
                    </div>
                    <div className="flex justify-center">
                        <table className="w-50  divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-r border-gray-600">Total Assets:</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold  uppercase tracking-wider border-gray-600">Total Debts:</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                        
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap border-r border-gray-600">$17,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap border-gray-600">$2,310</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Accounts;
