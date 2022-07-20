import React from "react";
import { LoadingOverlay, Header, ActionIcon } from "@mantine/core";
import axios from "axios";
import { _URL, getFormData } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PlusUser } from "../icons";
import { Trash } from "tabler-icons-react";
import { useSelector } from "react-redux";

function Rows({ item, setElements, datas, loading, isCompanys, isCitys }) {
  const { register, handleSubmit } = useForm();

  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(loading);

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    !data.insurance_company_ids &&
      (data.insurance_company_ids = item?.insurance_company_ids?.[0]);
    !data.city_id && (data.city_id = item.city_id);
    if (data?.id) {
      let formData = { ...data, role: "sdp" };
      delete formData.id;
      setIsLoading(true);
      axios
        .patch(`${_URL}/sdp/${item?.id}`, getFormData(formData), {
          headers: {
            Authorization: `"Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
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
    if (!item.id) {
      setIsLoading(true);
      delete data?.new;
      delete data?.id;
      axios
        .post(`${_URL}/sdp`, getFormData(data), {
          headers: {
            Authorization: `"Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setElements(
            [...datas, res?.data?.message?.sdp].filter((item) => !item?.new)
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
    <form className="row" onSubmit={handleSubmit(onSubmit)}>
      <LoadingOverlay visible={isLoading} />
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
        type="tel"
        {...register(`phone`)}
      />
      <input
        onInput={(e) => {
          e.target.value !== item?.email
            ? setIsUpdated(true)
            : setIsUpdated(false);
        }}
        defaultValue={item?.email}
        type="email"
        {...register(`email`)}
      />

      <select
        onInput={(e) => {
          setIsUpdated(true);

          item.city_id = e.target.value;
        }}
        value={isCitys.find((options) => options.id === item?.city_id)?.id}
        {...register(`city_id`)}
      >
        {isCitys.map((options) => (
          <option
            // selected={options.id === item?.city_id}
            key={options?.id}
            value={options?.id}
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
        className="multiples-select"
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
      {isUpdated ? (
        <button type="submit" onClick={() => {}}>
          {item?.id ? "Update" : "Create"}
        </button>
      ) : (
        <div
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
                .delete(`${_URL}/sdp/${item.id}`)
                .then((res) => {
                  setIsLoading(false);
                  setElements(datas.filter((__res) => __res?.id !== item?.id));
                  toast.success("Deleted");
                })
                .catch((err) => {
                  console.log(err);
                  setIsLoading(false);
                  toast.error("Error when deleting data");
                });
            }
          }}
        >
          <ActionIcon color="red">
            <Trash size={16} />
          </ActionIcon>
        </div>
      )}
    </form>
  );
}

export default function Sdp() {
  const [elements, setElements] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isCompanys, setIsCompanys] = React.useState([]);
  const [isCitys, setIsCitys] = React.useState([]);
  const user = useSelector((state) => state.user);

  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await axios
        .get(
          `${_URL}${
            user.role === "superadmin"
              ? "/sdp"
              : user.role === "insurance_company" &&
                `/sdp?insurance_company_id=${user.insurance_company.id}`
          }`,
          {
            headers: {
              Authorization: `"Bearer ${
                JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                  .token
              } `,
            },
          }
        )
        .then((res) => {
          setElements(res?.data?.message?.sdp);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (user.role === "insurance_company") {
      setIsCompanys([user.insurance_company]);
    }
    if (user.role === "superadmin") {
      axios
        .get(`${_URL}/insurance-companies`, {
          headers: {
            Authorization: `"Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
        .then((res) => {
          setIsCompanys(res?.data?.message?.insurance_companies);
        });
    }
    axios
      .get(`${_URL}/city`, {
        headers: {
          Authorization: `"Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
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
            value={"insurance_company_id"}
          />
          <input className="disabled" readOnly={true} value={"first_name"} />
          <input className="disabled" readOnly={true} value={"last_name"} />
          <input className="disabled " readOnly={true} value={"phone"} />
          <input className="disabled " readOnly={true} value={"email"} />
          <input className="disabled " readOnly={true} value={"city"} />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"address"}
          />
          <input className="disabled " readOnly={true} value={"login_id"} />
        </div>
        {elements?.map((item, i) => (
          <Rows
            key={item?.id ?? i}
            item={item}
            setElements={setElements}
            datas={elements}
            loading={loading}
            isCompanys={isCompanys}
            isCitys={isCitys}
          />
        ))}
      </div>
    </>
  );
}
