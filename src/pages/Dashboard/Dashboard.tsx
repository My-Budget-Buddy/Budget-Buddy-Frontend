import { LineChart, Gauge } from "@mui/x-charts";
import { Accordion, Table, Icon, Button } from "@trussworks/react-uswds";

const Dashboard: React.FC = () => {

    return (
        <div className="flex flex-col flex-wrap content-center">
            <div className="w-11/12">
                <h1>Welcome [add user name]</h1>
                <div className="flex">
                    <div id="chart-container" className="flex-auto w-2/3">
                        <h1>Chart</h1>
                        <LineChart
                            series={[
                                {
                                data: [2, 5.5, 2, 8.5, 1.5, 5],
                                },
                            ]}
                            // width={500}
                            height={300}
                        />
                    </div>
                    <div id="accounts-container" className="flex-auto w-1/3">
                        <h1>Accounts</h1>
                        <Accordion bordered={false} items={
                            [
                                {
                                    title: "Checking",
                                    content: (<p>test</p>),
                                    expanded: false,
                                    id: "Checking",
                                    headingLevel: "h4",
                                }
                                ,
                                {
                                    title: "Credit Cards",
                                    content: (<p>test</p>),
                                    expanded: false,
                                    id: "credit-cards",
                                    headingLevel: "h4",
                                },
                                {
                                    title: "Net Cash",
                                    content: (<p>test</p>),
                                    expanded: false,
                                    id: "net-cash",
                                    headingLevel: "h4",
                                },
                                {
                                    title: "Savings",
                                    content: (<p>test</p>),
                                    expanded: false,
                                    id: "savings",
                                    headingLevel: "h4",
                                },
                                {
                                    title: "Investments",
                                    content: (<p>test</p>),
                                    expanded: false,
                                    id: "investments",
                                    headingLevel: "h4",
                                },
                            ]
                        } />
                    </div>
                </div>
                <div id="transactions-container" className="flex flex-col flex-wrap">
                    <h1>Recent Transactions</h1>
                    <Table className="w-full">
                        <thead>
                            <tr>
                                <th>
                                    Date
                                </th>
                                <th>
                                    Name
                                </th>
                                <th>
                                    Category
                                </th>
                                <th>
                                    Amount
                                </th>
                                <th>
                                    
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    test
                                </td>
                                <td>
                                    test
                                </td>
                                <td>
                                    test
                                </td>
                                <td>
                                    <Icon.AttachMoney />
                                    test
                                </td>
                                <td >
                                    <Icon.NavigateNext />
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button type="submit" onClick={()=> {}}>View All Transactions</Button>
                </div>
                <div id="budgets-container">
                    <h1>Budgets</h1>
                    <div className="flex">
                        <Gauge width={100} height={100} value={60} />
                        <p>[Budget namet]</p>
                        <p>
                            <Icon.AttachMoney />
                            [Amount spent so far]
                        </p>
                    </div>
                    <Button type="submit" onClick={()=> {}}>View Full Budget</Button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
