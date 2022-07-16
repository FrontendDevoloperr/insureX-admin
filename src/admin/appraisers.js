import React from "react";
import { LoadingOverlay, Header } from "@mantine/core";
import axios from "axios";
import { getFormData, _URL } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DeleteIcon, PlusUser } from "../icons";

function Rows({
  item,
  setElements,
  datas,
  loading,
  isCompanys,
  isCitys,
  isRegions,
  appraiselCompanys,
}) {
  const { register, handleSubmit } = useForm();

  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(loading);

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    !data?.appraisal_company_id &&
      (data.appraisal_company_id =
        item?.appraisal_company_id ?? appraiselCompanys[0]?.id);
    !data?.city_id && (data.city_id = item?.city_id ?? isCitys[0]?.id);
    !data?.region_id && (data.region_id = item?.region_id ?? isRegions[0]?.id);
    if (!data?.new && data?.id) {
      const formData = data;
      delete formData.id;
      delete formData.city_id;

      setIsLoading(true);
      axios
        .patch(`${_URL}/appraisers/${item.id}`, getFormData(formData))
        .then((res) => {
          setIsLoading(false);
          toast.success("Updated");
          setIsUpdated(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toast.error("Error while updating data");
        });
    }
    if (!data?.id) {
      console.log(data);
      const formData = data;
      setIsLoading(true);
      delete formData?.new;
      delete formData?.id;
      axios
        .post(`${_URL}/appraisers`, getFormData(formData))
        .then((res) => {
          setIsLoading(false);
          setElements(
            [...datas, res.data.message.appraiser].filter((item) => !item.new)
          );
          toast.success("Data uploaded, new users created");
          setIsUpdated(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toast.error("Error loading data, please try again");
        });
    }
  };

  return (
    <>
      <form className="row" onSubmit={handleSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoading} />
        <select
          className="multiples-select"
          onInput={(e) => {
            e.target.value !== item?.insurance_company_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
            item.insurance_company_id = e.target.value;
          }}
          value={
            isCompanys?.filter(
              (options) => options.id === item?.insurance_company_id
            )[0]?.id
          }
          {...register(`insurance_company_id`)}
        >
          {isCompanys?.map((options) => (
            <option key={options.id} value={options.id}>
              {options.title}
            </option>
          ))}
        </select>
        <select
          onInput={(e) => {
            e.target.value !== item?.appraisal_company_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
            item.appraisal_company_id = e.target.value;
          }}
          value={
            appraiselCompanys?.find(
              (options) => options?.id === item?.appraisal_company_id
            )?.id
          }
          {...register(`appraisal_company_id`)}
        >
          {appraiselCompanys?.map((options) => (
            <option
              key={options?.id}
              value={options?.id}
              // selected={item?.city_id === options?.id}
            >
              {options?.appraisal_company_name}
            </option>
          ))}
        </select>
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
        <select
          onInput={(e) => {
            e.target.value !== item?.region_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
            item.region_id = e.target.value;
          }}
          value={
            isRegions?.find((options) => options.id === item?.region_id)?.id
          }
          {...register(`region_id`)}
        >
          {isRegions?.map((options) => (
            <option
              key={options?.id}
              value={options?.id}
              // selected={item?.city_id === options?.id}
            >
              {options?.region_name}
            </option>
          ))}
        </select>

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
          <button type="submit">{item?.id ? "Update" : "Create"}</button>
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
                    toast.success("Removed");
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
  const [isCitys, setIsCitys] = React.useState([]);
  const [appraiselCompanys, setAppraiselCompanys] = React.useState([]);

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
    axios.get(`${_URL}/appraisal-companies`).then((res) => {
      setAppraiselCompanys(res?.data?.message?.appraisal_companies);
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
                "You cannot add new entries until you finish the previous one."
              );
            } else {
              setElements(elements?.concat([{ new: true }])?.reverse());
              toast.success("You can fill in a new entry");
            }
          }}
        >
          <span>Add </span>
          <PlusUser color={"#fff"} />
        </button>
      </Header>
      <div className="ox-scroll">
        <LoadingOverlay visible={loading} />
        <div className="row">
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"insurance_company "}
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
          <input className="disabled" readOnly={true} value={"city"} />
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
            isCitys={isCitys}
            appraiselCompanys={appraiselCompanys}
          />
        ))}
      </div>
    </>
  );
}
