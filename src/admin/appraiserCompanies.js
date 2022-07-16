import React from "react";
import { Table } from "@mantine/core";
import axios from "axios";
import { _URL } from "../utils";

export default function AppraiserCompanies() {
  const [appraiserCompanies, setAppraiserCompanies] = React.useState([]);
  const [insuredCompany, setInsuredCompany] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/appraisal-companies`);
      console.log(result?.data?.message?.appraisal_companies, "appraiserCompanies");
      setAppraiserCompanies(result?.data?.message?.appraisal_companies);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/insurance-companies`);
      setInsuredCompany(result?.data?.message?.insurance_companies);
    };
    fetchData();
  }, []);

  //   const rows = [];
  const rows = appraiserCompanies.map((element) => (
    <tr key={element?.id}>
      <td>
        {insuredCompany.map((item) => {
          if (item.id === element?.insurance_company_ids) {
            return item.title;
          }
        })}
      </td>
      <td>{element?.appraisal_company_name}</td>
      <td>{element?.oao_ie_number}</td>
      <td>{element?.phone}</td>
      <td>{element?.email}</td>
      <td>{element?.office_address}</td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>insurance_companies</th>
          <th>appraisal_company_name</th>
          <th>oao_ie_number</th>
          <th>phone</th>
          <th>email</th>
          <th>office_address</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
