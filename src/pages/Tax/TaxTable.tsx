/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { Button, Table } from "@trussworks/react-uswds";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaxNav from "./TaxNav";
import { deleteTaxReturn, getTaxReturnByUserId } from "./taxesAPI";
import { useDispatch, useSelector } from "react-redux";
import { setAllTaxReturns } from "./TaxReturnSlice";
import { RootState } from "../../util/redux/store";
import { taxReturn } from "./TaxReturnSlice";
import { useAuthentication } from "../../contexts/AuthenticationContext";

const DisplayTaxTables: React.FC = () => {
    const { jwt } = useAuthentication();
    const nav = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        getTaxReturnByUserId(jwt, 1)
            .then((res) => {
                dispatch(setAllTaxReturns(res.data)); // Assuming res.data is an array of tax return items
            })
            .catch((err) => console.error(err));
    }, [jwt]);

    const allTaxReturns = useSelector((state: RootState) => state.taxReturn.taxReturns);

    const [sortedData, setSortedData] = useState<taxReturn[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof taxReturn | null;
        direction: "ascending" | "descending" | null;
    }>({ key: null, direction: null });

    useEffect(() => {
        setSortedData(allTaxReturns);
    }, [allTaxReturns]);

    const handleSort = (key: keyof taxReturn) => {
        let direction: "ascending" | "descending" | null = "ascending";
        if (sortConfig.key === key) {
            if (sortConfig.direction === "ascending") {
                direction = "descending";
            } else if (sortConfig.direction === "descending") {
                direction = null;
            }
        }

        if (direction === null) {
            setSortedData([...allTaxReturns]); // Reset to initial unsorted data
            setSortConfig({ key: null, direction: null });
        } else {
            const sortedArray = [...sortedData].sort((a, b) => {
                const aValue = a[key] as any;
                const bValue = b[key] as any;

                if (aValue === undefined || bValue === undefined) {
                    return 0;
                }

                if (aValue < bValue) {
                    return direction === "ascending" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
            setSortedData(sortedArray);
            setSortConfig({ key, direction });
        }
    };

    const getSortIndicator = (key: keyof taxReturn) => {
        if (!sortConfig || sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === "ascending" ? "▲" : "▼";
    };

    const redirectToEditView = () => {
        nav("/dashboard/tax/1/w2/0");
    };

    const handleDelete = (id: number | undefined) => {
        deleteTaxReturn(id);
    };

    const currentYear = new Date().getFullYear();

    const currentYearTaxReturns = sortedData.filter((data) => data.year === currentYear);
    const archivedTaxReturns = sortedData.filter((data) => data.year !== currentYear);

    return (
        <>
            <div className="flex flex-col flex-wrap content-center">
                <div>
                    <TaxNav />
                </div>
                <div>
                    <h2>Tax Forms</h2>
                    <Table fullWidth fixed striped>
                        <thead>
                            <tr>
                                <th>Filing Status</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Year</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentYearTaxReturns.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.filingStatus}</td>
                                    <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td>{data.year}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="usa-button usa-button--primary"
                                                onClick={redirectToEditView}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="usa-button usa-button--secondary"
                                                onClick={() => handleDelete(data.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <h2>Tax Form Archives</h2>
                    <Table fullWidth fixed striped>
                        <thead>
                            <tr>
                                <th>Filing Status</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Year</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {archivedTaxReturns.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.filingStatus}</td>
                                    <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td>{data.year}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="usa-button usa-button--primary">View</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default DisplayTaxTables;
