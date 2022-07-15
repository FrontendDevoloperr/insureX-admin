import React from "react";
import { Table } from "@mantine/core";
import axios from "axios";
import { _URL } from "../utils";

export default function InsuredEvent() {
  const [insuredCompany, setInsuredCompany] = React.useState([]);
  const [insuredPerson, setInsuredPerson] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/insured-events`);
      console.log(result.data.message);
      setEvents(result?.data?.message?.insured_events);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/insurance-companies`);
      console.log(result.data.message);
      setInsuredCompany(result?.data?.message?.insurance_companies);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/insured-persons`);
      console.log(result.data.message);
      setInsuredPerson(result?.data?.message?.insured_persons);
    };
    fetchData();
  }, []);

  console.log(insuredPerson, "dasdasdsdasds");

  const rows = events.map((element) => (
    <tr key={element?.id}>
      <td>
        {insuredCompany.map((item) => {
          if (item.id === element?.insurance_company_id) {
            return item.title;
          }
        })}
      </td>
      <td>{element?.insured_event_number}</td>
      <td>
        {insuredPerson.map((item) => {
          if (item.id === element?.insured_person_id) {
            return item.first_name;
          }
        })}
      </td>
      <td>{element?.id}</td>
      <td>{element?.region_id}</td>
      <td>{element?.address}</td>
      <td>{element?.date}</td>
      <td>{element?.agent_id}</td>
      <td>{element?.appraisal_company_id}</td>
      <td>{element?.appraiser_id}</td>
      <td>{element?.garage_name}</td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>insurance_companies</th>
          <th>insured_event_number</th>
          <th>insured_person</th>
          <th>event_type</th>
          <th>region</th>
          <th>address</th>
          <th>date</th>
          <th>agent</th>
          <th>appraisal_company</th>
          <th>appraiser</th>
          <th>garage_name</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
