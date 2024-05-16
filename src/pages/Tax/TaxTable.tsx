import { Button, Form, TextInput, FormGroup, Label, Textarea, Fieldset, DatePicker, Select, RequiredMarker, StepIndicator, StepIndicatorStep, CardGroup, CardHeader, CardBody, CardFooter, Card, GridContainer, Grid, Accordion, Table   } from '@trussworks/react-uswds';
import React from 'react';
import { ChangeEvent, FormEvent, useState, useEffect, FocusEvent} from 'react';
import { useNavigate } from 'react-router-dom';


const DisplayTaxTables: React.FC = () => {
    const nav = useNavigate();
    interface TableData {
      formType: string;
      organization: string;
      year: number;
    }
    
    const initialData: TableData[] = [
      { formType: 'Form A', organization: 'Org 1', year: 2021 },
      { formType: 'Form B', organization: 'Org 2', year: 2022 },
      { formType: 'Form C', organization: 'Org 3', year: 2023 },
    ];
  
    const [mockData] = useState<TableData[]>(initialData);
    const [sortedData, setSortedData] = useState<TableData[]>(initialData);
    const [sortConfig, setSortConfig] = useState<{ key: keyof TableData | null, direction: 'ascending' | 'descending' | null }>({ key: null, direction: null });
  
    const handleSort = (key: keyof TableData) => {
      let direction: 'ascending' | 'descending' | null = 'ascending';
      if (sortConfig.key === key) {
        if (sortConfig.direction === 'ascending') {
          direction = 'descending';
        } else if (sortConfig.direction === 'descending') {
          direction = null;
        }
      }
  
      if (direction === null) {
        setSortedData([...mockData]); // Reset to initial unsorted data
        setSortConfig({ key: null, direction: null });
      } else {
        const sortedArray = [...sortedData].sort((a, b) => {
          if (a[key] < b[key]) {
            return direction === 'ascending' ? -1 : 1;
          }
          if (a[key] > b[key]) {
            return direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
        setSortedData(sortedArray);
        setSortConfig({ key, direction });
      }
    };
  
    const getSortIndicator = (key: keyof TableData) => {
      if (!sortConfig || sortConfig.key !== key) {
        return null;
      }
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };

    const redirectToEditView = () =>{
        nav('/dashboard/tax/w2/0')
    }
  
    return (
      <>
        <div>
          <h2>Tax Forms</h2>
          <Table fullWidth fixed striped>
            <thead>
              <tr>
                <th>Form Type</th>
                <th>Organization</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((data, index) => (
                <tr key={index}>
                  <td>{data.formType}</td>
                  <td>{data.organization}</td>
                  <td>{data.year}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="usa-button usa-button--primary" onClick={redirectToEditView}>Edit</button>
                      <button className="usa-button usa-button--secondary">Delete</button>
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
                <th>Form Type</th>
                <th onClick={() => handleSort('organization')} style={{ cursor: 'pointer' }}>
                  Organization {getSortIndicator('organization')}
                </th>
                <th onClick={() => handleSort('year')} style={{ cursor: 'pointer' }}>
                  Year {getSortIndicator('year')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((data, index) => (
                <tr key={index}>
                  <td>{data.formType}</td>
                  <td>{data.organization}</td>
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
      </>
    );
  };


    export default DisplayTaxTables;