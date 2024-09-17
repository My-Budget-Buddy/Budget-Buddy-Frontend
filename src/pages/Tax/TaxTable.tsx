import {

  Button,
  Icon,
  Table

} from '@trussworks/react-uswds';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaxNav from './TaxNav';
import { deleteTaxReturn, getTaxReturnByUserId } from './taxesAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setAllTaxReturns } from './TaxReturnSlice';
import { RootState } from '../../util/redux/store';
import { taxReturn } from './TaxReturnSlice';
//commenting out the line below because it was removed from the useeffect for testing purposes
//import { useAuthentication } from '../../contexts/AuthenticationContext';
import { useTranslation } from 'react-i18next';

const DisplayTaxTables: React.FC = () => {
  //commenting out the line below because it was removed from the useeffect for testing purposes
 // const { jwt } = useAuthentication();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    getTaxReturnByUserId()
      .then((res) => {
        dispatch(setAllTaxReturns(res.data)); // Assuming res.data is an array of tax return items
      })
      .catch((err) => console.error(err));
      //making the dependency blank so that it appears quicker for selenium tests
  }, []);


  const allTaxReturns = useSelector((state: RootState) => state.taxReturn.taxReturns);

  const [sortedData, setSortedData] = useState<taxReturn[]>([]);
  // const [sortConfig, setSortConfig] = useState<{
  //     key: keyof taxReturn | null;
  //     direction: "ascending" | "descending" | null;
  // }>({ key: null, direction: null });

  useEffect(() => {
    setSortedData(allTaxReturns);
  }, [allTaxReturns]);

  // const handleSort = (key: keyof taxReturn) => {
  //     let direction: "ascending" | "descending" | null = "ascending";
  //     if (sortConfig.key === key) {
  //         if (sortConfig.direction === "ascending") {
  //             direction = "descending";
  //         } else if (sortConfig.direction === "descending") {
  //             direction = null;
  //         }
  //     }

  //     if (direction === null) {
  //         setSortedData([...allTaxReturns]); // Reset to initial unsorted data
  //         setSortConfig({ key: null, direction: null });
  //     } else {
  //         const sortedArray = [...sortedData].sort((a, b) => {
  //             const aValue = a[key] as any;
  //             const bValue = b[key] as any;

  //             if (aValue === undefined || bValue === undefined) {
  //                 return 0;
  //             }

  //             if (aValue < bValue) {
  //                 return direction === "ascending" ? -1 : 1;
  //             }
  //             if (aValue > bValue) {
  //                 return direction === "ascending" ? 1 : -1;
  //             }
  //             return 0;
  //         });
  //         setSortedData(sortedArray);
  //         setSortConfig({ key, direction });
  //     }
  // };

  // const getSortIndicator = (key: keyof taxReturn) => {
  //     if (!sortConfig || sortConfig.key !== key) {
  //         return null;
  //     }
  //     return sortConfig.direction === "ascending" ? "▲" : "▼";
  // };

  const redirectToEditView = (id: number | undefined) => {
    nav(`/dashboard/tax/${id}/w2/0`);

  };

  const handleDelete = (id: number | undefined) => {
    deleteTaxReturn(id);
  };



  const currentYear = new Date().getFullYear();

  const currentYearTaxReturns = sortedData.filter(data => data.year === currentYear);
  const archivedTaxReturns = sortedData.filter(data => data.year !== currentYear);

  return (
    <>
      <div className="flex flex-col flex-wrap content-center">
        <div>
          <TaxNav />
        </div>
        <div>

          <div className="shadow-md border-[1px] p-10">
            <h2 className="text-3xl font-semibold">{t("tax.tax-forms")}</h2>
            <Table fullWidth fixed>
              <thead>
                <tr>
                  <th>{t("tax.filing-status")}</th>
                  <th>{t("tax.first-name")}</th>
                  <th>{t("tax.last-name")}</th>
                  <th>{t("tax.year")}</th>
                  <th>{t("tax.actions")}</th>

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
                        <Button type="button" onClick={() => redirectToEditView(data.id)} unstyled id="edit-button"><Icon.Edit /></Button>
                        <Button type="button" onClick={() => handleDelete(data.id)} unstyled id = "delete-button"><Icon.Delete /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h2 className="text-3xl font-semibold mt-10">{t("tax.tax-form-archives")}</h2>
            <Table fullWidth fixed>
              <thead>
                <tr>
                  <th>{t("tax.filing-status")}</th>
                  <th>{t("tax.first-name")}</th>
                  <th>{t("tax.last-name")}</th>
                  <th>{t("tax.year")}</th>
                  <th>{t("tax.actions")}</th>
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
                        <button className="usa-button usa-button--primary">{t("tax.view")}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayTaxTables;
