import React from "react";
import { LoadingOverlay, Header, ActionIcon } from "@mantine/core";
import axios from "axios";
import { _URL, getFormData } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PlusUser } from "../icons";
import { useLocation } from "react-router-dom";
import { Trash } from "tabler-icons-react";
import { useSelector } from "react-redux";

function Rows({
  item,
  setElements,
  datas,
  loading,
  isCompanys,
  isCitys,
  agents,
  isNowEdit,
}) {
  const { register, handleSubmit } = useForm();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(loading);

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    !data.insurance_company_id &&
      (data.insurance_company_id =
        item.insurance_company_id ?? isCompanys[0]?.id);
    !data.city_id && (data.city_id = item.city_id ?? isCitys[0]?.id);
    !data.agent_id && (data.agent_id = item.agent_id ?? agents[0].id);
    if (data?.id) {
      let formData = { ...data, role: "insured_person" };
      delete formData.id;
      setIsLoading(true);
      axios
        .patch(`${_URL}/insured-persons/${item?.id}`, getFormData(formData), {
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
      data.role = "insured_person";
      axios
        .post(`${_URL}/insured-persons`, getFormData(data), {
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
            [...datas, res?.data?.message?.insured_person].filter(
              (item) => !item?.new
            )
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
      <form
        className={`row ${isNowEdit ? "now-edit" : ""}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <LoadingOverlay visible={isLoading} />
        <input
          autoFocus={isNowEdit}
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
        <select
          onInput={(e) => {
            e.target.value !== item?.insurance_company_id
              ? setIsUpdated(true)
              : setIsUpdated(false);

            item.insurance_company_id = e.target.value;
          }}
          value={
            isCompanys.filter(
              (options) => options.id === item?.insurance_company_id
            )[0]?.id
          }
          {...register(`insurance_company_id`)}
        >
          {isCompanys.map((options) => (
            <option key={options.id} value={options.id}>
              {options.title}
            </option>
          ))}
        </select>
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
        <input
          onInput={(e) => {
            e.target.value !== item?.address
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.address}
          {...register(`address`)}
        />
        <select
          onInput={(e) => {
            e.target.value !== item?.agent_id
              ? setIsUpdated(true)
              : setIsUpdated(false);

            item.agent_id = e.target.value;
          }}
          value={
            agents?.filter((options) => options.id === item?.agent_id)[0]?.id
          }
          {...register(`agent_id`)}
        >
          {agents?.map((options) => (
            <option key={options?.id} value={options?.id}>
              {options?.first_name}
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
                  .patch(
                    `${_URL}/insured-persons/${item.id}`,
                    getFormData({
                      delete: true,
                    }),
                    {
                      headers: {
                        Authorization: `"Bearer ${
                          JSON.parse(
                            localStorage.getItem("admin-panel-token-insure-x")
                          ).token
                        } `,
                      },
                    }
                  )
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
    </>
  );
}

export default function Persons() {
  const [elements, setElements] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isCompanys, setIsCompanys] = React.useState([]);
  const [isCitys, setIsCitys] = React.useState([]);
  const [agents, setAgent] = React.useState([]);
  const location = useLocation();
  const user = useSelector((state) => state.user);

  React.useEffect(() => {
    if (user.role === "superadmin") {
      setLoading(true);
      const fetchData = async () => {
        await axios
          .get(`${_URL}/insured-persons`, {
            headers: {
              Authorization: `"Bearer ${
                JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                  .token
              } `,
            },
          })
          .then((res) => {
            setElements(res?.data?.message?.insured_persons);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      };
      fetchData();
    }
    if (user.role === "insurance_company") {
      setLoading(true);
      const fetchData = async () => {
        await axios
          .get(
            `${_URL}/insured-persons?insurance_company_id=${user.insurance_company.id}`,
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
            setElements(res?.data?.message?.insured_persons);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      };
      fetchData();
    }
  }, [user.role]);

  React.useEffect(() => {
    if (user.role === "insurance_company") {
      setIsCompanys([user.insurance_company]);
    }
    if (user.role === "superadmin" || user.role === "appraisal_company") {
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
          setIsCompanys(
            res?.data?.message?.insurance_companies?.filter(
              (item) => !item?.delete
            )
          );
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
    axios
      .get(`${_URL}/agents/select`, {
        headers: {
          Authorization: `"Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
        setAgent(res?.data?.message?.agents);
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
          <input className="disabled" readOnly={true} value={"address"} />
          <input className="disabled" readOnly={true} value={"agent ID"} />
          <input className="disabled" readOnly={true} value={"city ID"} />
        </div>
        {elements
          ?.filter((resp) => !resp.delete)
          .map((item, i) => (
            <Rows
              key={item?.id ?? i}
              item={item}
              setElements={setElements}
              datas={elements}
              loading={loading}
              isCompanys={isCompanys}
              isCitys={isCitys}
              agents={agents}
              isNowEdit={
                Number(location.hash.split("#")[1]) === Number(item?.id)
              }
            />
          ))}
      </div>
    </>
  );
}
