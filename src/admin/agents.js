import React from "react";
import { LoadingOverlay, Header, MultiSelect, ActionIcon } from "@mantine/core";
import axios from "axios";
import { _URL, getFormData } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PlusUser } from "../icons";
import { Trash } from "tabler-icons-react";
import { useSelector } from "react-redux";

function Rows({ item, setElements, datas, loading, isCompanys, isRegions }) {
  const user = useSelector((state) => state.user);
  const { register, handleSubmit } = useForm();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(loading);

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    !data.insurance_company_ids &&
      (data.insurance_company_ids = item.insurance_company_ids);
    !data.region_id && (data.region_id = item.region_id);
    if (data?.id) {
      let formData = { ...data, role: "agent" };
      delete formData.id;
      setIsLoading(true);
      axios
        .patch(`${_URL}/agents/${item?.id}`, getFormData(formData), {
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
        .post(`${_URL}/agents`, getFormData(data), {
          headers: {
            Authorization:
              "Bearer " +
                JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                  .token || "",
          },
        })
        .then((res) => {
          setIsLoading(false);
          setElements(
            [...datas, res?.data?.message?.agent].filter((item) => !item?.new)
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
        <MultiSelect
          className="input-multi-select"
          style={{
            width: "200px",
          }}
          defaultValue={item?.insurance_company_ids}
          onChange={(e) => {
            setIsUpdated(true);
            item.insurance_company_ids = e;
          }}
          data={isCompanys.map((item) => ({
            value: item?.id,
            label: item?.title,
            custome_disabled:
              user.role === "insurance_company"
                ? item?.id !== user.insurance_company.id
                  ? "true"
                  : "false"
                : "",
          }))}
          transition="pop-top-left"
          transitionDuration={80}
          transitionTimingFunction="ease"
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
                  .delete(`${_URL}/agents/${item.id}`)
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
  const [isRegions, setIsRegions] = React.useState([]);
  const user = useSelector((state) => state.user);

  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await axios
        .get(
          `${_URL}${
            user.role === "superadmin"
              ? "/agents/select"
              : user.role === "insurance_company"
              ? `/agents/select?insurance_company_id=${user.insurance_company.id}`
              : ""
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
          setElements(
            res?.data?.message?.agents?.filter((item) =>
              user.role === "insurance_company"
                ? item?.insurance_company_ids.find(
                    (_res) => _res === user.insurance_company.id
                  )
                : item
            )
          );
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
    axios
      .get(`${_URL}/insurance-companies`, {
        headers: {
          Authorization: `"Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
        setIsCompanys(res?.data?.message?.insurance_companies);
      });
    axios
      .get(`${_URL}/regions`, {
        headers: {
          Authorization: `"Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
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
