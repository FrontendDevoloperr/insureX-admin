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
  const [openSelect, setOpenSelect] = React.useState(false);

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    !data.insurance_company_ids &&
      (data.insurance_company_ids = item.insurance_company_ids);
    !data.region_id && (data.region_id = item.region_id);
    if (data?.id) {
      let formData = data;
      delete formData.id;
      setIsLoading(true);
      axios
        .patch(`${_URL}/agents/${item?.id}`, getFormData(formData))
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
        .post(`${_URL}/agents`, getFormData(data))
        .then((res) => {
          setIsLoading(false);
          setElements(
            [...datas, res?.data?.message?.agents].filter((item) => !item?.new)
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
          onInput={(e) => {
            setIsUpdated(true);
          }}
          defaultValue={item?.first_name}
          {...register(`first_name`)}
        />
        <input
          onInput={(e) => {
            e.target.value !== item?.second_name
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.second_name}
          {...register(`second_name`)}
        />
        <div className="multiples-select">
          <div
            className="select-wrap"
            onClick={() => setOpenSelect(!openSelect)}
          >
            INSURANCE COMPANIES {!openSelect && <span>^</span>}
          </div>

          {openSelect && (
            <div className="body-select">
              {isCompanys.map((options) => (
                <label>
                  <input
                    onInput={(e) => {
                      setIsUpdated(true);
                    }}
                    type={"checkbox"}
                    defaultChecked={item?.insurance_company_ids?.includes(
                      options.id
                    )}
                    key={options.id}
                    {...register(`insurance_company_ids`)}
                    value={options.id}
                  />
                  <div className="label">
                    <p>{options?.title}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
        <input
          onInput={(e) => {
            e.target.value !== item?.passport_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.passport_id}
          {...register(`passport_id`)}
        />
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
        <input
          onInput={(e) => {
            e.target.value !== item?.employee_number
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.employee_number}
          {...register(`employee_number`)}
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
            e.target.value !== item?.address
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.address}
          {...register(`address`)}
        />
        {isUpdated ? (
          <button type="submit" onClick={() => {}}>
            {item?.id ? "IsUpdate" : "IsCreate"}
          </button>
        ) : (
          <button
            title="Удалить"
            type="button"
            className="delete"
            onClick={() => {
              if (!item?.id) {
                setElements(datas.filter((item) => item?.new !== true));
              }
              if (item?.id) {
                setIsLoading(true);
                axios
                  .delete(`${_URL}/agents/${item.id}`)
                  .then((res) => {
                    setIsLoading(false);
                    setElements(
                      datas.filter((__res) => __res?.id !== item?.id)
                    );
                    toast.success("Удалено");
                  })
                  .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                    toast.error("Ошибка при удалении данных");
                  });
              }
            }}
          >
            <DeleteIcon />
          </button>
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

  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await axios
        .get(`${_URL}/agents`)
        .then((res) => {
          setElements(res?.data?.message?.agents);
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
          <input className="disabled" readOnly={true} value={"first_name"} />
          <input className="disabled" readOnly={true} value={"last_name"} />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"insurance_company"}
          />
          <input className="disabled" readOnly={true} value={"passport_id"} />
          <input className="disabled" readOnly={true} value={"phone"} />
          <input className="disabled" readOnly={true} value={"email"} />
          <input
            className="disabled"
            readOnly={true}
            value={"employee_number"}
          />
          <input className="disabled" readOnly={true} value={"region"} />
          <input className="disabled" readOnly={true} value={"address"} />
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
          />
        ))}
      </div>
    </>
  );
}
