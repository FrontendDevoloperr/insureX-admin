import React from "react";
import { LoadingOverlay, Header } from "@mantine/core";
import axios from "axios";
import { _URL, getFormData } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DeleteIcon, PlusUser } from "../icons";

function Rows({
  item,
  setElements,
  datas,
  loading,
  isCompanys,
  isRegions,
  isCitys,
}) {
  const { register, handleSubmit } = useForm();

  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(loading);

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    !data.insurance_company_ids &&
      (data.insurance_company_ids = item?.insurance_company_ids?.[0]);
    !data.region_id && (data.region_id = item.region_id);
    !data.city_id &&
      !data.city_id === "null" &&
      !data.city_id === null &&
      (data.city_id = item.city_id === "null" ? isCitys[0]?.id : item.city_id);
    if (data?.id) {
      let formData = {
        ...data,
        insurance_company_id: data.insurance_company_ids,
      };
      delete formData.id;
      delete formData.insurance_company_ids;
      console.log(formData);
      setIsLoading(true);
      axios
        .patch(`${_URL}/appraisal-companies/${item?.id}`, getFormData(formData))
        .then((res) => {
          setIsLoading(false);
          toast.success("Обновлено");
          setIsUpdated(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toast.error("Ошибка при обновлении данных");
        });
    }
    if (!item.id) {
      setIsLoading(true);
      delete data?.new;
      delete data?.id;
      axios
        .post(`${_URL}/appraisal-companies`, getFormData(data))
        .then((res) => {
          setIsLoading(false);
          setElements(
            [...datas, res?.data?.message?.appraisal_companies].filter(
              (item) => !item?.new
            )
          );
          toast.success("Данные загружены, Создано новых пользователей");
          setIsUpdated(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toast.error(
            "Ошибка при загрузке данных, пожалуйста повторите попытку"
          );
        });
    }
  };

  return (
    <>
      <form className="row" onSubmit={handleSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoading} />
        <input
          className="multiples-select"
          onInput={(e) => {
            setIsUpdated(true);
          }}
          defaultValue={item?.appraisal_company_name}
          {...register(`appraisal_company_name`)}
        />

        <select
          className="multiples-select"
          onInput={(e) => {
            e.target.value !== item?.insurance_company_ids?.[0]
              ? setIsUpdated(true)
              : setIsUpdated(false);
            item.insurance_company_ids = e.target.value;
          }}
          value={
            isCompanys?.filter(
              (options) => options.id === item?.insurance_company_ids?.[0]
            )[0]?.id
          }
          {...register(`insurance_company_ids`)}
        >
          {isCompanys?.map((options) => (
            <option key={options.id} value={options.id}>
              {options.title}
            </option>
          ))}
        </select>
        <input
          onInput={(e) => {
            e.target.value !== item?.phone
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.phone}
          {...register(`phone`)}
        />
        <input
          onInput={(e) => {
            e.target.value !== item?.email
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.email}
          {...register(`email`)}
        />
        <select
          onInput={(e) => {
            e.target.value !== item?.region_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
            item.region_id = e.target.value;
          }}
          value={
            isRegions.filter((options) => options.id === item?.region_id)[0]?.id
          }
          {...register(`region_id`)}
        >
          {isRegions.map((options) => (
            <option key={options?.id} value={options?.id}>
              {options?.region_name}
            </option>
          ))}
        </select>
        <input
          onInput={(e) => {
            e.target.value !== item?.office_address
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.office_address}
          {...register(`office_address`)}
        />
        <select
          onInput={(e) => {
            e.target.value !== item?.city_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
            item.city_id = e.target.value;
          }}
          value={
            isCitys.filter((options) => options.id === item?.city_id)[0]?.id
          }
          {...register(`city_id`)}
        >
          {isCitys.map((options) => (
            <option
              key={options?.id}
              value={options?.id}
              // selected={item?.city_id === options?.id}
            >
              {options?.city_name}
            </option>
          ))}
        </select>
        {isUpdated ? (
          <button type="submit" onClick={() => {}}>
            {item?.id ? "IsUpdate" : "IsCreate"}
          </button>
        ) : (
          ""
        )}
      </form>
    </>
  );
}

export default function Persons() {
  const [elements, setElements] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isCompanys, setIsCompanys] = React.useState([]);
  const [isRegions, setIsRegions] = React.useState([]);
  const [isCitys, setIsCitys] = React.useState([]);

  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await axios
        .get(`${_URL}/appraisal-companies`)
        .then((res) => {
          setElements(res?.data?.message?.appraisal_companies);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast.error("Ошибка при загрузке данных, похоже на серверную ошибку");
        });
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    axios.get(`${_URL}/insurance-companies`).then((res) => {
      setIsCompanys(res?.data?.message?.insurance_companies);
    });
    axios.get(`${_URL}/regions`).then((res) => {
      setIsRegions(res?.data?.message?.regions);
    });
    axios.get(`${_URL}/city`).then((res) => {
      setIsCitys(res?.data?.message?.cities);
    });
  }, []);

  return (
    <>
      <Header height={60} p="xs">
        <button
          className="adder"
          onClick={() => {
            if (elements.filter((item) => item?.new)?.length) {
              toast.error(
                "Нельзя добавлять новые записи пока не закончите предыдущую"
              );
            } else {
              setElements(elements?.concat([{ new: true }])?.reverse());
              toast.success("Можно заполнять новую запись");
            }
          }}
        >
          <span>Добавить </span>
          <PlusUser color={"#fff"} />
        </button>
      </Header>
      <div className="ox-scroll">
        <LoadingOverlay visible={loading} />
        <div className="row">
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"appraisal_company_name"}
          />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"insurance_company_ids"}
          />
          <input className="disabled" readOnly={true} value={"phone"} />
          <input className="disabled" readOnly={true} value={"email"} />
          <input className="disabled" readOnly={true} value={"region"} />
          <input
            className="disabled"
            readOnly={true}
            value={"office_address"}
          />
          <input className="disabled" readOnly={true} value={"city"} />
        </div>
        {elements?.map((item, i) => (
          <Rows
            key={item?.id ?? i}
            item={item}
            setElements={setElements}
            datas={elements}
            loading={loading}
            isCompanys={isCompanys}
            isRegions={isRegions}
            isCitys={isCitys}
          />
        ))}
      </div>
    </>
  );
}
