import { Icon, Table } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import SavingsBucketRow from "./SavingsBucketRow";
import NewBucketModal from "../modals/NewBucketModal";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { updateBuckets } from "../../../../util/redux/bucketSlice";
import { SavingsBucketRowProps } from "../../../../types/budgetInterfaces";
import { getBuckets } from "../requests/bucketRequests";
import { useTranslation } from "react-i18next";
//IMPORTANT-  This ensures that key can only be 'id', 'name', 'amount_required', 'amount_reserved', or 'is_currently_reserved'.
//Avoid just treating keys as a generic string
type SortableKeys = keyof SavingsBucketRowProps["data"];

function SavingsBucketTable() {
    const [listOfBuckets, setListOfBuckets] = useState<SavingsBucketRowProps[]>([]);
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const storedBuckets = useAppSelector((state) => state.buckets.buckets);
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);
    const [sortingOrder, setSortingOrder] = useState<{ key: SortableKeys | null; direction: string }>({
        key: "name",
        direction: "asc"
    });

    // TODO Calculate total reserved and push that to the redux store every GET
    // const totalReserved = useAppSelector((state) => state.buckets.totalReserved);

    // Updates the redux store with fresh buckets from the database
    useEffect(() => {
        (async () => {
            const transformedBuckets = await getBuckets();
            dispatch(updateBuckets(transformedBuckets));
        })();
    }, [isSending]);

    // Anytime the buckets in the redux changes, this updates the pages' state to reflect the new buckets.
    useEffect(() => {
        const sortedBuckets = sortBuckets(storedBuckets, sortingOrder.key!, sortingOrder.direction);
        setListOfBuckets(sortedBuckets);
        // TODO Calculated total reserved then Dispatch to totalReserved.
    }, [storedBuckets]);

    const sortBuckets = (buckets: SavingsBucketRowProps[], key: SortableKeys, direction: string) => {
        return [...buckets].sort((a: SavingsBucketRowProps, b: SavingsBucketRowProps) => {
            const aValue = a.data[key];
            const bValue = b.data[key];

            if (aValue < bValue) {
                return direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const sortListBuckets = (key: SortableKeys) => {
        let direction = "asc";
        if (sortingOrder.key === key && sortingOrder.direction === "asc") {
            direction = "desc";
        }
        setSortingOrder({ key, direction });
        const sortedBuckets = sortBuckets(listOfBuckets, key, direction);
        setListOfBuckets(sortedBuckets);
    };

    // render an up or down arrow depending on if the sorted category is ascending or descending
    const renderSortArrow = (key: SortableKeys) => {
        if (sortingOrder.key === key) {
            return sortingOrder.direction === "asc" ? <Icon.ArrowDropUp /> : <Icon.ArrowDropDown />;
        }
        return null;
    };

    return (
        <>
            <Table className="w-full">
                <thead>
                    <tr>
                        <th scope="col" onClick={() => sortListBuckets("name")}>
                            {t("budgets.name")} {renderSortArrow("name")}
                        </th>
                        <th scope="col" onClick={() => sortListBuckets("amount_required")}>
                            {t("budgets.required")} {renderSortArrow("amount_required")}
                        </th>
                        <th scope="col" onClick={() => sortListBuckets("amount_reserved")}>
                            {t("budgets.reserved")} {renderSortArrow("amount_reserved")}
                        </th>
                        <th scope="col"> </th>
                        <th scope="col">{t("budgets.actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {listOfBuckets.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center align-middle">
                                <h1>{t("budgets.no-buckets")}</h1>
                                {t("budgets.click")}{" "}
                                <span className="font-bold text-[#005ea2]">{t("budgets.add-new-bucket")}</span>{" "}
                                {t("budgets.to-add-bucket")}
                            </td>
                        </tr>
                    ) : (
                        listOfBuckets.map((rowData: SavingsBucketRowProps) => (
                            <SavingsBucketRow key={rowData.data.id} data={rowData.data} />
                        ))
                    )}
                </tbody>
            </Table>

            <div className="flex flex-col items-center">
                <NewBucketModal>{t("budgets.add-new-bucket")}</NewBucketModal>
            </div>
        </>
    );
}

export default SavingsBucketTable;
