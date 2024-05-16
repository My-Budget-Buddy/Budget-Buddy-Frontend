import { LineChart, Gauge } from "@mui/x-charts";
import { Accordion, Table, Icon, Button } from "@trussworks/react-uswds";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col flex-wrap content-center">
      <div className="w-full">
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
            <Accordion
              bordered={false}
              items={[
                {
                  title: (
                    <div className="flex justify-between">
                      <p>
                        <Icon.AccountBalance /> Checking
                      </p>
                      <p>
                        <Icon.AttachMoney />
                        [money]
                      </p>
                    </div>
                  ),
                  content: <p>test</p>,
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
                      <p>
                        <Icon.AttachMoney />
                        [money]
                      </p>
                    </div>
                  ),
                  content: <p>test</p>,
                  expanded: false,
                  id: "credit-cards",
                  headingLevel: "h4",
                },
                {
                  title: (
                    <div className="flex justify-between">
                      <p>
                        <Icon.AccountBalance /> Net Cash
                      </p>
                      <p>
                        <Icon.AttachMoney />
                        [money]
                      </p>
                    </div>
                  ),
                  content: <p>test</p>,
                  expanded: false,
                  id: "net-cash",
                  headingLevel: "h4",
                },
                {
                  title: (
                    <div className="flex justify-between">
                      <p>
                        <Icon.AccountBalance /> Savings
                      </p>
                      <p>
                        <Icon.AttachMoney />
                        [money]
                      </p>
                    </div>
                  ),
                  content: <p>test</p>,
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
                      <p>
                        <Icon.AttachMoney />
                        [money]
                      </p>
                    </div>
                  ),
                  content: <p>test</p>,
                  expanded: false,
                  id: "investments",
                  headingLevel: "h4",
                },
              ]}
            />
          </div>
        </div>
        <div id="transactions-container" className="flex flex-col flex-wrap">
          <h1>Recent Transactions</h1>
          <Table className="w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>test</td>
                <td>test</td>
                <td>test</td>
                <td>
                  <Icon.AttachMoney />
                  test
                </td>
                <td>
                  <Icon.NavigateNext />
                </td>
              </tr>
            </tbody>
          </Table>
          <Button type="submit" onClick={() => {}}>
            View All Transactions
          </Button>
        </div>
        <div id="budgets-container">
          <h1>Budgets</h1>
          <div className="flex items-center">
            <Gauge width={150} height={150} value={60} />
            <div className="w-3/5 flex flex-col items-center">
              <div id="budget-items" className="grid-row flex-justify">
                <p>[Budget namet]</p>
                <p>
                  <Icon.AttachMoney />
                  [Amount spent so far]
                </p>
              </div>
              <div id="budget-items" className="grid-row flex-justify">
                <p>[Budget namet]</p>
                <p>
                  <Icon.AttachMoney />
                  [Amount spent so far]
                </p>
              </div>
              <div id="budget-items" className="grid-row flex-justify">
                <p>[Budget namet]</p>
                <p>
                  <Icon.AttachMoney />
                  [Amount spent so far]
                </p>
              </div>
              <Button
                className="dashboard-btn"
                type="submit"
                onClick={() => {}}
              >
                View Full Budget
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
