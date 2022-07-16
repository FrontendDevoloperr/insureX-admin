import React from "react";
import { Table } from "@mantine/core";
import axios from "axios";
import { _URL } from "../utils";
import { toast } from "react-hot-toast";

export default function InsuranceCompany() {
  const [InsuranceCompany, setInsuranceCompany] = React.useState([]);
  const [insuredCompany, setInsuredCompany] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${_URL}/insurance-companies`)
        .then((res) => {
          setInsuranceCompany(res?.data?.message?.insurance_companies);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Ошибка при загрузке данных, похоже на серверную ошибку");
        });
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
  const rows = InsuranceCompany.map((element) => (
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
