import React from "react";
import { Table } from "@mantine/core";
import axios from "axios";
import { _URL } from "../utils";

export default function Agents() {
  const [agent, setAgent] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/agents`);
      setAgent(result?.data?.message?.agents);
    };
    fetchData();
  }, []);

  const rows = agent.map((element) => (
    <tr key={element?.id}>
      <td>{element?.insurance_company_ids}</td>
      <td>{element?.first_name}</td>
      <td>{element?.second_name}</td>
      <td>{element?.employee_number}</td>
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
          <th>first_name</th>
          <th>Last name</th>
          <th>employee_number</th>
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
