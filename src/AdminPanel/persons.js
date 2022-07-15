import React from "react";
import { ScrollArea, LoadingOverlay } from "@mantine/core";
import axios from "axios";
import { _URL } from "../utils";
import { useForm } from "react-hook-form";

function Rows({ item }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log({ ...data, id: item.id });
  const [isUpdated, setIsUpdated] = React.useState(false);
  return (
    <>
      <form className="row" onSubmit={handleSubmit(onSubmit)}>
        <input
          onChange={(e) => {
            setIsUpdated(true);
          }}
          defaultValue={item?.first_name}
          {...register(`first_name`)}
        />
        <input
          onChange={(e) => {
            e.target.value !== item?.second_name && setIsUpdated(true);
          }}
          defaultValue={item?.second_name}
          {...register(`second_name`)}
        />
        <input
          onChange={(e) => {
            e.target.value !== item?.insurance_company_id && setIsUpdated(true);
          }}
          defaultValue={item?.insurance_company_id}
          {...register(`insurance_company_id`)}
        />
        <input
          onChange={(e) => {
            e.target.value !== item?.passport_id && setIsUpdated(true);
          }}
          defaultValue={item?.passport_id}
          {...register(`passport_id`)}
        />
        <input
          onChange={(e) => {
            e.target.value !== item?.phone && setIsUpdated(true);
          }}
          defaultValue={item?.phone}
          {...register(`phone`)}
        />
        <input
          onChange={(e) => {
            e.target.value !== item?.email && setIsUpdated(true);
          }}
          defaultValue={item?.email}
          {...register(`email`)}
        />
        <input
          onChange={(e) => {
            e.target.value !== item?.region_id && setIsUpdated(true);
          }}
          defaultValue={item?.region_id}
          {...register(`region_id`)}
        />
        <input
          onChange={(e) => {
            e.target.value !== item?.address && setIsUpdated(true);
          }}
          defaultValue={item?.address}
          {...register(`address`)}
        />
        <input
          onChange={(e) => {
            e.target.value !== item?.login_id && setIsUpdated(true);
          }}
          defaultValue={item?.login_id}
          {...register(`login_id`)}
        />
        {
          <>
            <button type="submit">IsUpdate</button>
            <button type="submit" className="delete">isDelet</button>
          </>
        }
      </form>
    </>
  );
}

export default function Persons() {
  const [elements, setElements] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const result = await axios.get(`${_URL}/insured-persons`);
      setElements(result?.data?.message?.insured_persons);
      console.log(result?.data?.message?.insured_persons);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingOverlay visible={loading} />
      ) : (
        <div className="ox-scroll">
          <div className="row">
            <input className="disabled" readOnly={true} value={"first_name"} />
            <input className="disabled" readOnly={true} value={"last_name"} />
            <input
              className="disabled"
              readOnly={true}
              value={"insurance_company_id"}
            />
            <input className="disabled" readOnly={true} value={"passport_id"} />
            <input className="disabled" readOnly={true} value={"phone"} />
            <input className="disabled" readOnly={true} value={"email"} />
            <input className="disabled" readOnly={true} value={"region"} />
            <input className="disabled" readOnly={true} value={"address"} />
            <input className="disabled" readOnly={true} value={"login ID"} />
            <input className="disabled" readOnly={true} value={"funtions"} />
          </div>
          {elements.map((item) => (
            <Rows key={item?.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
