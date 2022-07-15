import React from "react";
import { Table } from "@mantine/core";
import axios from "axios";
import { _URL } from "../utils";

export default function Sdp() {
  const [sdp, setSdp] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/sdp`);
      setSdp(result?.data?.message?.sdp);
    };
    fetchData();
  }, []);

  //   const rows = [];
  const rows = sdp.map((element) => (
    <tr key={element?.id}>
      <td>
        <select>
          {element?.insurance_company_ids?.map((element) => (
            <option key={element}>{element}</option>
          ))}
        </select>
      </td>
      <td>{element?.first_name}</td>
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
          <th>name</th>
          <th>phone</th>
          <th>email</th>
          {/* <th>ooo_number</th>
          <th>ie_number</th>
          <th>employee_number</th> */}
          <th>region</th>
          <th>address</th>
          <th>login_id</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
