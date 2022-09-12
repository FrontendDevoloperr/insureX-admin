import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Trash } from "tabler-icons-react";
import { useSelector, useDispatch } from "react-redux";
import {
  LoadingOverlay,
  Header,
  MultiSelect,
  ActionIcon,
  Grid,
} from "@mantine/core";
import { _URL, getFormData } from "../utils";
import { PlusUser } from "../icons";
import { getAgents } from "../redux/reducer/agents";
import SearchComponent from "../ui/search";

function Rows({ item, datas, isCompanys, isRegions, dispatch }) {
  const user = useSelector(({ user }) => user);
  const { register, handleSubmit } = useForm();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [insurance_company_ids, setInsurance_company_ids] = React.useState(
    item?.insurance_company_ids
  );

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    data.insurance_company_ids = insurance_company_ids;
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
          dispatch(
            getAgents(
              [...datas, res?.data?.message?.agent].filter((item) => !item?.new)
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
          placeholder="choose..."
          style={{
            width: "200px",
          }}
          defaultValue={item?.insurance_company_ids}
          onChange={(e) => {
            setIsUpdated(true);
            setInsurance_company_ids(e);
          }}
          data={isCompanys?.map((item) => ({
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
            isRegions?.filter((options) => options.id === item?.region_id)[0]
              ?.id
          }
          {...register(`region_id`)}
        >
          {isRegions?.map((options) => (
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
                dispatch(getAgents(datas.filter((item) => item?.new !== true)));
              }
              if (item?.id) {
                setIsLoading(true);
                axios
                  .patch(
                    `${_URL}/agents/${item.id}`,
                    getFormData({
                      delete: true,
                    })
                  )
                  .then((res) => {
                    setIsLoading(false);
                    dispatch(
                      getAgents(datas.filter((__res) => __res?.id !== item?.id))
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
  const dispatch = useDispatch();
  const elements = useSelector(({ agents }) => agents?.agents);
  const isCompanys = useSelector(
    ({ insuredCmp }) => insuredCmp?.insuredCompanies
  );
  const isRegions = useSelector(({ region }) => region?.region);
  const user = useSelector(({ user }) => user);
  const [filteredData, setFilteredData] = React.useState([]);
  const [inputText, setInputText] = React.useState("");

  return (
    <>
      <Header height={60} p="xs">
        <Grid align="center">
          <Grid.Col span={3}>
            <button
              className="adder"
              onClick={() => {
                if (elements.filter((item) => item?.new)?.length) {
                  toast.error(
                    "You cannot add new entries until you finish the previous one."
                  );
                } else {
                  dispatch(
                    getAgents(elements?.concat([{ new: true }])?.reverse())
                  );
                  toast.success("You can fill in a new entry");
                }
              }}
            >
              <span>Add </span>
              <PlusUser color={"#fff"} />
            </button>
          </Grid.Col>
          <Grid.Col span={3}>
            <SearchComponent
              data={elements?.filter((resp) =>
                !resp.delete && user?.role === "insurance_company"
                  ? user?.insurance_company?.id === resp?.insurance_company_id
                  : resp
              )}
              setFilteredData={setFilteredData}
              setInputText={setInputText}
              type={"first_name"}
            />
          </Grid.Col>
        </Grid>
      </Header>
      <div className="ox-scroll">
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
        {(inputText?.length > 2
          ? filteredData
          : elements?.filter((resp) =>
              !resp.delete && user?.role === "insurance_company"
                ? user?.insurance_company?.id === resp?.insurance_company_id
                : resp
            )
        ).map((item, i) => (
          <Rows
            key={item?.id ?? i}
            item={item}
            datas={elements}
            isCompanys={isCompanys}
            isRegions={isRegions}
            dispatch={dispatch}
          />
        ))}
      </div>
    </>
  );
}
