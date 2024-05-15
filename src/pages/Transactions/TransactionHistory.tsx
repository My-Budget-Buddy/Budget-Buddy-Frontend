/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, CardBody, CardGroup, CardHeader, Table, Title } from "@trussworks/react-uswds";




function TransactionHistory() {
    const Name: string = "Hot dogs";
    const transactions: any = [
        {
            "id": 10,
            "Date": "10/11/2023",
            "Name": "Hot dog breakfast",
            "Category": "Food",
            "Amount": "2.33"
        },
        {
            "id": 11,
            "Date": "10/11/2023",
            "Name": "Hot dog wating for train",
            "Category": "Food",
            "Amount": "4.66"
        },
        {
            "id": 12,
            "Date": "10/11/2023",
            "Name": "Hot dog at lunch",
            "Category": "Food",
            "Amount": "9.33"
        },
        {
            "id": 13,
            "Date": "10/12/2023",
            "Name": "Hot dog breakfast",
            "Category": "Food",
            "Amount": "2.33"
        },
        {
            "id": 14,
            "Date": "10/12/2023",
            "Name": "Hot dog wating for train",
            "Category": "Food",
            "Amount": "4.66"
        },
        {
            "id": 15,
            "Date": "10/12/2023",
            "Name": "Hot dog at lunch",
            "Category": "Food",
            "Amount": "9.33"
        }
    ]
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
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Actions</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction: any) => (
                                        <tr key={transaction.id}>
                                            <td>{transaction.Date}</td>
                                            <td>{transaction.Name}</td>
                                            <td>{transaction.Category}</td>
                                            <td><Button type={"button"}>Note</Button><Button type={"button"}>Del</Button></td>
                                            <td>{transaction.Amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                    <Card gridLayout={{ col: 4 }}>
                        <CardHeader>Summary</CardHeader>
                        <CardBody>
                            Total spent: {transactions.reduce((sum: any, cur: any) => sum + Number(cur.Amount), 0.0)}
                            <hr />
                            Total transactions: {transactions.length}
                        </CardBody>
                    </Card>
                </CardGroup>
            </div>
        </>
    )
}

export default TransactionHistory