import { Card, CardBody, CardGroup, CardHeader, Table, Title } from "@trussworks/react-uswds";

const TransactionHistory: React.FC = () => {
    const Name: string = "temp";
    const total: number = 1000.00;
    const transactions: number = 2;
    return (
        <>
            <div className="px-5">
                <Title>{`${Name} transaction history`}</Title>
                <CardGroup>
                    <Card gridLayout={{ col: 8 }}>
                        <CardHeader>
                            <h1>All transactions</h1>
                        </CardHeader>
                        <CardBody>
                            <Table bordered={false} fullWidth={true}>
                                <tr>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                    <th>Amount</th>
                                </tr>
                                <tr>
                                    <td>

                                    </td>
                                </tr>
                            </Table>
                        </CardBody>
                    </Card>
                    <Card gridLayout={{ col: 4 }}>
                        <CardHeader>Summary</CardHeader>
                        <CardBody>
                            Total spent: {total}
                            <hr />
                            Total transactions: {transactions}
                        </CardBody>
                    </Card>
                </CardGroup>
            </div>
        </>
    )
}

export default TransactionHistory