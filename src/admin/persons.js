import React from "react";
import {
  LoadingOverlay,
  Header,
  ActionIcon,
  Grid,
  MultiSelect,
} from "@mantine/core";
import axios from "axios";
import { _URL, getFormData } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PlusUser } from "../icons";
import { useLocation } from "react-router-dom";
import { Trash } from "tabler-icons-react";
import { useDispatch, useSelector } from "react-redux";
import { getPersons } from "../redux/reducer/insuredPerson";
import { getInsuredPersonFC } from "./index";
import SearchComponent from "../ui/search";

function Rows({
  item,
  dispatch,
  isCompanys,
  isCitys,
  agents,
  isNowEdit,
  user,
}) {
  const { register, handleSubmit } = useForm();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCityOpenSelect, setIsCityOpenSelect] = React.useState(false);
  const [isCompaniesOpenSelect, setIsCompaniesOpenSelect] =
    React.useState(false);
  const [insurance_company_ids, setInsurance_company_ids] = React.useState(
    item?.insurance_company_persons_id
  );

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    data.insurance_company_persons_id = `{${insurance_company_ids}}`;
    data.insurance_company_id = insurance_company_ids[0];
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
          getInsuredPersonFC(dispatch);
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

        {isCompaniesOpenSelect && (
          <MultiSelect
            className="input-multi-select"
            placeholder="choose..."
            style={{
              width: "200px",
            }}
            defaultValue={item?.insurance_company_persons_id}
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
        )}
        {!isCompaniesOpenSelect && (
          <div onMouseMove={() => setIsCompaniesOpenSelect(true)}>
            <select
              type="text"
              className="custome-input"
              style={{
                width: "200px",
                cursor: "pointer",
              }}
              multiple
              defaultValue={insurance_company_ids}
              onClick={() => setIsCompaniesOpenSelect(true)}
            >
              {isCompanys
                ?.filter((cmp) => insurance_company_ids?.includes(cmp.id))
                ?.map(
                  (s, i) => i < 5 && <option value={s?.id}>{s.title}</option>
                )}
            </select>
          </div>
        )}

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
          }}
          defaultValue={
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
        {!isCityOpenSelect && (
          <input
            type="text"
            onFocus={() => setIsCityOpenSelect(true)}
            value={
              isCitys.find((options) => options.id === item?.city_id)?.city_name
            }
            readOnly={true}
          />
        )}
        {isCityOpenSelect && (
          <select
            onInput={() => setIsUpdated(true)}
            defaultValue={
              isCitys.find((options) => options.id === item?.city_id)?.id
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
        )}
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
                getInsuredPersonFC(dispatch);
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
                    getInsuredPersonFC(dispatch);
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
  // const [elements, setElements] = React.useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  let isCompanys = useSelector(
    ({ insuredCmp }) => insuredCmp?.insuredCompanies
  );
  const isCitys = useSelector(({ city }) => city?.city);
  const agents = useSelector(({ agents }) => agents?.agents);
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const elements = useSelector(({ persons }) => persons);
  const [filteredData, setFilteredData] = React.useState([]);
  const [inputText, setInputText] = React.useState("");

  React.useEffect(() => {
    if (user.role === "insurance_company") {
      isCompanys = [user.insurance_company];
    }
  }, []);

  return (
    <>
      <Header height={60} p="xs">
        <Grid align="center">
          <Grid.Col span={3}>
            <button
              className="adder"
              onClick={() => {
                if (elements?.filter((item) => item?.new)?.length) {
                  toast.error(
                    "You cannot add new entries until you finish the previous one."
                  );
                } else {
                  dispatch(
                    getPersons(elements?.concat([{ new: true }])?.reverse())
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
                  ? resp?.insurance_company_id === user?.insurance_company?.id
                  : resp
              )}
              setFilteredData={setFilteredData}
              setInputText={setInputText}
              type={[
                "first_name",
                "second_name",
                "phone",
                "email",
                "passport_id",
              ]}
            />
          </Grid.Col>
        </Grid>
      </Header>
      <div
        className="ox-scroll"
        style={{ minHeight: "max-content", overflow: "hidden" }}
      >
        <div className="row">
          <input className="disabled" readOnly={true} value={"first_name"} />
          <input className="disabled" readOnly={true} value={"last_name"} />
          <input
            className="disabled"
            readOnly={true}
            value={"insurance_company_id"}
            style={{ width: "200px" }}
          />
          <input className="disabled" readOnly={true} value={"passport_id"} />
          <input className="disabled" readOnly={true} value={"phone"} />
          <input className="disabled" readOnly={true} value={"email"} />
          <input className="disabled" readOnly={true} value={"address"} />
          <input className="disabled" readOnly={true} value={"agent ID"} />
          <input className="disabled" readOnly={true} value={"city ID"} />
          <input
            className="disabled"
            style={{ width: 66 }}
            readOnly={true}
            value={"delete"}
          />
        </div>
      </div>
      <div
        className="ox-scroll"
        onScroll={(e) => {
          [...Array(document.querySelectorAll(".ox-scroll").length)].map(
            (_, i) =>
              (document.querySelectorAll(".ox-scroll")[i].scrollLeft =
                e.target.scrollLeft)
          );
        }}
      >
        {(inputText.length > 2
          ? filteredData
          : elements?.filter((resp) =>
              !resp.delete && user?.role === "insurance_company"
                ? resp?.insurance_company_id === user?.insurance_company?.id
                : resp
            )
        )?.map((item, i) => (
          <Rows
            key={item?.id ?? i}
            item={item}
            dispatch={dispatch}
            datas={elements}
            isCompanys={isCompanys}
            isCitys={isCitys}
            agents={agents}
            isNowEdit={Number(location.hash.split("#")[1]) === Number(item?.id)}
            user={user}
          />
        ))}
      </div>
    </>
  );
}
