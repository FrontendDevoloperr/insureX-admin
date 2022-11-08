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
import { getInsuredPersonFC } from "../utils/request";
import SearchComponent from "../ui/search";

function Rows({
  item,
  dispatch,
  isCompanys,
  isCitys,
  agents,
  isNowEdit,
  user,
  datas,
  setElements,
}) {
  const { register, handleSubmit, setValue } = useForm();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCityOpenSelect, setIsCityOpenSelect] = React.useState(false);
  const [insurance_company_ids, setInsurance_company_ids] = React.useState(
    item?.insurance_company_persons_id
  );

  const onSubmit = (data) => {
    if (!insurance_company_ids[0]) {
      return toast.error("Insurance company not found");
    }
    data = { ...data, id: item.id };
    data.insurance_company_persons_id = `{${insurance_company_ids}}`;
    data.insurance_company_id = insurance_company_ids[0];
    if (data?.id) {
      let formData = { ...data, role: "insured_person" };
      delete formData.id;
      setIsLoading(true);
      axios
        .patch(`${_URL}/insured-persons/${item?.id}`, getFormData(formData))
        .then((res) => {
          setIsLoading(false);
          toast.success("Updated");
          getInsuredPersonFC(dispatch, user, "/persons");
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
        .post(`${_URL}/insured-persons`, getFormData(data))
        .then((res) => {
          setIsLoading(false);
          getInsuredPersonFC(dispatch, user, "/persons");
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

  React.useEffect(() => {
    if (!item?.id && item.new) {
      return Object.keys(item).forEach((key) => setValue(key, null));
    }
    Object.keys(item).forEach((key) => setValue(key, item[key]));
  }, [item, setValue]);

  return (
    <>
      <form
        className={`row ${isNowEdit ? "now-edit" : ""}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <LoadingOverlay visible={isLoading} />
        <input
          autoFocus={isNowEdit}
          onInput={(e) => setIsUpdated(true)}
          {...register(`first_name`)}
        />
        <input
          onInput={(e) => setIsUpdated(true)}
          {...register(`second_name`)}
        />

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

        <input
          onInput={(e) => setIsUpdated(true)}
          readOnly={item?.new ? false : true}
          {...register(`passport_id`)}
        />
        <input
          onInput={(e) => setIsUpdated(true)}
          type="tel"
          readOnly={item?.new ? false : true}
          {...register(`phone`)}
        />
        <input
          onInput={(e) => setIsUpdated(true)}
          type="email"
          {...register(`email`)}
        />
        <input onInput={(e) => setIsUpdated(true)} {...register(`address`)} />
        <select onInput={(e) => setIsUpdated(true)} {...register(`agent_id`)}>
          {agents?.map((options) => (
            <option key={options?.id} value={options?.id}>
              {options?.first_name}
            </option>
          ))}
        </select>
        {!isCityOpenSelect && (
          <input
            type="text"
            onMouseMove={() => setIsCityOpenSelect(true)}
            value={
              isCitys.find((options) => options.id === item?.city_id)?.city_name
            }
            readOnly={true}
          />
        )}
        {isCityOpenSelect && (
          <select onInput={() => setIsUpdated(true)} {...register(`city_id`)}>
            {isCitys.map((options) => (
              <option key={options?.id} value={options?.id}>
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
              if (item.new) {
                setElements(datas?.filter((item) => !item.new));
                toast.success("Removed");
              }
              if (item?.id && !item.new) {
                setIsLoading(true);
                axios
                  .patch(
                    `${_URL}/insured-persons/${item.id}`,
                    getFormData({
                      delete: true,
                    })
                  )
                  .then((res) => {
                    setIsLoading(false);
                    getInsuredPersonFC(dispatch, user, "/persons");
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
  const isCitys = useSelector(({ city }) => city?.city);
  const agents = useSelector(({ agents }) => agents?.agents);
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const persons = useSelector(({ persons }) => persons);
  const [elements, setElements] = React.useState([...persons]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [inputText, setInputText] = React.useState("");
  const cmps = useSelector(({ insuredCmp }) => insuredCmp?.insuredCompanies);

  React.useEffect(() => {
    setElements([...persons]);
  }, [persons]);

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
                  setElements(elements?.concat([{ new: true }]));
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
              data={elements}
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
        {(inputText.length > 2 ? filteredData : elements)
          ?.sort((a, b) => {
            if (a?.id > b?.id) return -1;
            if (a?.id < b?.id) return 1;
            return 0;
          })
          .reverse()
          .sort((a, b) => Number(b.new ?? false) - Number(a.new ?? false))

          .map((item, i) => (
            <Rows
              key={item?.id ?? i}
              item={item}
              dispatch={dispatch}
              datas={elements}
              isCompanys={cmps}
              isCitys={isCitys}
              agents={agents}
              isNowEdit={
                Number(location.hash.split("#")[1]) === Number(item?.id)
              }
              user={user}
              setElements={setElements}
            />
          ))}
      </div>
    </>
  );
}
