import React from "react";
import { LoadingOverlay, Header } from "@mantine/core";
import axios from "axios";
import { getFormData, _URL } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DeleteIcon, PlusUser } from "../icons";

function Rows({ item, setElements, datas }) {
  const { register, handleSubmit } = useForm();

  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    if (data?.id) {
      setIsLoading(true);
      axios
        .patch(`${_URL}/appraisers/${item.id}`, getFormData(data))
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
    if (!data?.id) {
      setIsLoading(true);
      delete data?.new;
      delete data?.id;
      axios
        .post(`${_URL}/appraisers`, getFormData(data))
        .then((res) => {
          setIsLoading(false);
          setElements(
            [...datas, res.data.message.appraiser].filter((item) => !item.new)
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
      <LoadingOverlay visible={isLoading} />
      <form className="row" onSubmit={handleSubmit(onSubmit)}>
        <input
          onInput={(e) => {
            e.target.value !== item?.insurance_company_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.insurance_company_id}
          {...register(`insurance_company_id`)}
        />
        <input
          onInput={(e) => {
            setIsUpdated(true);
          }}
          defaultValue={item?.appraisal_company_id}
          {...register(`appraisal_company_id`)}
        />
        <input
          onInput={(e) => {
            e.target.value !== item?.first_name
              ? setIsUpdated(true)
              : setIsUpdated(false);
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
            e.target.value !== item?.passport_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.passport_id}
          {...register(`passport_id`)}
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
            e.target.value !== item?.region_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.region_id}
          {...register(`region_id`)}
        />
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
                  .delete(`${_URL}/appraisers/${item.id}`)
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

  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await axios
        .get(`${_URL}/appraisers`)
        .then((res) => {
          setElements(res?.data?.message?.appraisers);
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
      {loading ? (
        <LoadingOverlay visible={loading} />
      ) : (
        <div className="ox-scroll">
          <div className="row">
            <input
              className="disabled"
              readOnly={true}
              value={"insurance_company"}
            />
            <input
              className="disabled"
              readOnly={true}
              value={"appraisal_company"}
            />
            <input className="disabled" readOnly={true} value={"fist_name"} />
            <input className="disabled" readOnly={true} value={"last_name"} />
            <input className="disabled" readOnly={true} value={"phone"} />
            <input className="disabled" readOnly={true} value={"Login ID"} />
            <input className="disabled" readOnly={true} value={"email"} />
            <input className="disabled" readOnly={true} value={"region"} />
            <input className="disabled" readOnly={true} value={"address"} />
            <input className="disabled fc" readOnly={true} value={""} />
          </div>
          {elements?.map((item, i) => (
            <Rows
              key={item?.id ?? i}
              item={item}
              setElements={setElements}
              datas={elements}
            />
          ))}
        </div>
      )}
    </>
  );
}
