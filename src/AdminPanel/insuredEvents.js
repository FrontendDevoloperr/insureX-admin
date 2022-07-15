import React from "react";
import { Table } from "@mantine/core";
import axios from "axios";
import { CaseTypeExtract, _URL } from "../utils";

export default function InsuredEvent() {
  const [insuredCompany, setInsuredCompany] = React.useState([]);
  const [insuredPerson, setInsuredPerson] = React.useState([]);
  const [appraiserCompany, setAppraiserCompany] = React.useState([]);
  const [regions, setRegions] = React.useState([]);
  // const [appraiserPerson, setAppraiserPerson] = React.useState([]);
  const [agents, setAgents] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/insured-events`);
      console.log(result?.data?.message?.insured_events, "events");
      setEvents(result?.data?.message?.insured_events);
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

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/insured-persons`);
      console.log(result?.data?.message?.insured_persons, "insuredPerson");

      setInsuredPerson(result?.data?.message?.insured_persons);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/appraisal-companies`);
      setAppraiserCompany(result?.data?.message?.appraisal_companies);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/agents`);
      setAgents(result?.data?.message?.agents);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/regions`);
      console.log(result?.data?.message?.regions, "regions");
      setRegions(result?.data?.message?.regions);
    };
    fetchData();
  }, []);

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await axios.get(`${_URL}/appraisers`);
  //     console.log(result?.data?.message?.appraisers, "appraisers");
  //     setAppraiserPerson(result?.data?.message?.appraiser_id);
  //   };
  //   fetchData();
  // }, []);

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
          if (item?.id === element?.insured_person_id) {
            return `${item?.first_name} ${item?.second_name}`;
          }
        })}
      </td>
      {/* <td>{CaseTypeExtract(CASE_DATA)?.name}</td> */}
      <td>
        {regions.map((item) => {
          if (item.id === element?.region_id) {
            return item?.region_name;
          }
        })}
      </td>
      <td>{element?.address}</td>
      <td>{element?.date}</td>
      <td>
        {agents.map((item) => {
          if (item.id === element?.agent_id) {
            return `${item.first_name} ${item.second_name}`;
          }
        })}
      </td>
      <td>
        {appraiserCompany.map((item) => {
          if (item.id === element?.appraisal_company_id) {
            return item.appraisal_company_name;
          }
        })}
      </td>
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
