import { LineChart, Gauge } from "@mui/x-charts";
import { Accordion, Table, Icon, Button, ModalToggleButton, Modal, ModalHeading, ModalFooter, ModalRef } from "@trussworks/react-uswds";
import { useRef } from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
    const modalRef = useRef<ModalRef>(null)

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
                            [{
                                title: (
                                    <div className="flex justify-between">
                                        <p><Icon.AccountBalance/> Checking</p>
                                        <p><Icon.AttachMoney/>[money]</p>
                                    </div>
                                ),
                                content: (<p>test</p>),
                                expanded: false,
                                id: "Checking",
                                headingLevel: "h4",
                            }
                            ,
                            {
                                title: (
                                    <div className="flex justify-between">
                                        <p><Icon.CreditCard/> Credit Cards</p>
                                        <p><Icon.AttachMoney/>[money]</p>
                                    </div>
                                ),
                                content: (<p>test</p>),
                                expanded: false,
                                id: "credit-cards",
                                headingLevel: "h4",
                            },
                            {
                                title: (
                                    <div className="flex justify-between">
                                        <p><Icon.AccountBalance/> Net Cash</p>
                                        <p><Icon.AttachMoney/>[money]</p>
                                    </div>
                                ),
                                content: (<p>test</p>),
                                expanded: false,
                                id: "net-cash",
                                headingLevel: "h4",
                            },
                            {
                                title: (
                                    <div className="flex justify-between">
                                        <p><Icon.AccountBalance/> Savings</p>
                                        <p><Icon.AttachMoney/>[money]</p>
                                    </div>
                                ),
                                content: (<p>test</p>),
                                expanded: false,
                                id: "savings",
                                headingLevel: "h4",
                            },
                            {
                                title: (
                                    <div className="flex justify-between">
                                        <p><Icon.AccountBalance/> investments</p>
                                        <p><Icon.AttachMoney/>[money]</p>
                                    </div>
                                ),
                                content: (<p>test</p>),
                                expanded: false,
                                id: "investments",
                                headingLevel: "h4",
                            }]
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
                                    <ModalToggleButton modalRef={modalRef} opener>
                                        <Icon.NavigateNext />
                                    </ModalToggleButton>
                                    <Modal ref={modalRef} id="example-modal-1" aria-labelledby="modal-1-heading" aria-describedby="modal-1-description">
                                        <ModalHeading id="modal-1-heading">
                                            [Name]
                                        </ModalHeading>
                                        <div className="usa-prose">
                                            <p id="modal-1-description">
                                            [account]
                                            [date]
                                            </p>
                                            <p id="modal-1-description">
                                            [category]
                                            [amount]
                                            </p>
                                        </div>
                                        <ModalFooter>
                                            <ModalToggleButton modalRef={modalRef} closer>
                                                Go Back
                                            </ModalToggleButton>
                                        </ModalFooter>
                                    </Modal>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <Link to="/dashboard/transactions" className="text-center">
                        <Button type="submit" >View All Transactions</Button>
                    </Link>
                </div>
                <div id="budgets-container">
                    <h1>Budgets</h1>
                    <div className="flex items-center">
                        <Gauge width={150} height={150} value={60} />
                        <div className="w-3/5 flex flex-col items-center">
                            <div id="budget-items" className="grid-row flex-justify">
                                <p>[Budget name]</p>
                                <p>
                                    <Icon.AttachMoney />
                                    [Amount spent so far]
                                </p>
                            </div>
                            <div id="budget-items" className="grid-row flex-justify">
                                <p>[Budget name]</p>
                                <p>
                                    <Icon.AttachMoney />
                                    [Amount spent so far]
                                </p>
                            </div>
                            <div id="budget-items" className="grid-row flex-justify">
                                <p>[Budget name]</p>
                                <p>
                                    <Icon.AttachMoney />
                                    [Amount spent so far]
                                </p>
                            </div>
                            <Link to="/dashboard/budgets">
                                <Button className="mt-10" type="submit" >View Full Budget</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
