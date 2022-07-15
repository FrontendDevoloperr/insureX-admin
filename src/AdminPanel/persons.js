import React from "react";
import { Table } from "@mantine/core";
import axios from "axios";
import { _URL } from "../utils";

export default function Persons() {
  const [elements, setElements] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/insured-persons`);
      setElements(result?.data?.message?.insured_persons);
      console.log(result?.data?.message?.insured_persons);
    };
    fetchData();
  }, []);

  const rows = elements.map((element) => (
    <tr key={element?.id}>
      <td>{element?.first_name}</td>
      <td>{element?.second_name}</td>
      <td>{element?.insurance_company_id}</td>
      <td>{element?.passport_id}</td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>First name</th>
          <th>Last name</th>
          <th>Insurance company</th>
          <th>Login ID</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
