import React from "react";
import { Table } from "@mantine/core";
import axios from "axios";
import { _URL } from "../utils";

export default function Appraisers() {
  const [appraiser, setAppraiser] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/appraisers`);
      setAppraiser(result?.data?.message?.appraisers);
      console.log(result?.data?.message?.appraisers);
    };
    fetchData();
  }, []);

  //   const rows = [];
  const rows = appraiser.map((element) => (
    <tr key={element?.id}>
      <td>{element?.insurance_company_id}</td>
      <td>{element?.appraisal_company_id}</td>
      <td>{element?.first_name}</td>
      <td>{element?.second_name}</td>
      <td>{element?.phone}</td>
      <td>{element?.email}</td>
      <td>{element?.region_id}</td>
      <td>{element?.address}</td>
      <td>{element?.login_id}</td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>insurance_companies</th>
          <th>appraisal_company</th>
          <th>first_name</th>
          <th>second_name</th>
          {/* <th>ooo_number</th>
          <th>ie_number</th>
          <th>employee_number</th> */}
          <th>phone</th>
          <th>email</th>
          <th>region</th>
          <th>address</th>
          <th>login_id</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
