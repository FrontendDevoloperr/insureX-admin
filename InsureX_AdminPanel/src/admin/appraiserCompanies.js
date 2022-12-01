import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Trash } from "tabler-icons-react";
import {
  LoadingOverlay,
  Header,
  ActionIcon,
  Grid,
  Checkbox,
  MultiSelect,
  Select,
} from "@mantine/core";
import axios from "axios";
import { _URL, getFormData } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PlusUser } from "../icons";
import SearchComponent from "../ui/search";
import { getAppraiserCompFC } from "../utils/request";

function Rows({
  item,
  setElements,
  datas,
  isCompanys,
  isRegions,
  isCitys,
  dispatch,
  user,
}) {
  const { register, handleSubmit, setValue } = useForm();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [cityValue, setCityValue] = React.useState(
    isCitys.find((options) => Number(options.id) === Number(item?.city_id))?.id
  );
  const [regionValue, setRegionValue] = React.useState(
    isRegions.find((options) => Number(options.id) === Number(item?.region_id))
      ?.id
  );
  const [isChecked, setIsChecked] = React.useState(item?.authentification);
  const [insuranceCompany, setInsuranceCompany] = React.useState(
    item?.insurance_company_ids
  );

  const onSubmit = (data) => {
    if (!cityValue || !insuranceCompany[0])
      return toast.error("Fill them all in");
    data = { ...data, id: item.id };
    data.region_id = regionValue;
    data.city_id = cityValue;
    if (data?.id) {
      setIsLoading(true);
      data.insurance_company_ids = insuranceCompany;
      data.insurance_company_id = insuranceCompany;
      delete data.id;
      axios
        .patch(`${_URL}/appraisal-companies/${item?.id}`, data)
        .then((res) => {
          getAppraiserCompFC(dispatch, user, "/appraisal-companies");
          setIsLoading(false);
          setIsUpdated(false);
          toast.success("Updated");
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
      data.passport_id = data?.oao_ie_number;
      data.role = "appraisal_company";
      axios
        .post(`${_URL}/appraisal-companies`, getFormData(data))
        .then((res) => {
          getAppraiserCompFC(dispatch, user, "/appraisal-companies");
          toast.success("Data uploaded, new users created");
          setIsUpdated(false);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toast.error("Error loading data, please try again");
        });
    }
  };

  const patchAutification = (data) => {
    if (!item.id) return setIsChecked(false);
    const formData = {
      authentification: !isChecked,
      update: "authentification",
    };
    setIsLoading(true);
    axios
      .patch(
        `${_URL}/appraisal-companies/delete/${item?.id}`,
        getFormData(formData)
      )
      .then(({ data }) => {
        setIsLoading(false);
        setIsChecked(!isChecked);
        getAppraiserCompFC(dispatch, user, "/appraisal-companies");
      })
      .catch((err) => {
        setIsLoading(false);
        setIsChecked(isChecked);
        console.log(err);
      });
  };

  return (
    <>
      <form className="row" onSubmit={handleSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoading} />
        <Checkbox
          type="checkbox"
          checked={isChecked}
          defaultValue={item?.authentification}
          onChange={patchAutification}
          className="checkbox_inp"
        />
        <input
          className="multiples-select"
          onInput={(e) => {
            setIsUpdated(true);
          }}
          defaultValue={item?.appraisal_company_name}
          {...register(`appraisal_company_name`)}
        />
        <input
          onInput={(e) => {
            setIsUpdated(true);
          }}
          readOnly={item?.new ? false : true}
          defaultValue={item?.oao_ie_number}
          {...register(`oao_ie_number`)}
        />

        <MultiSelect
          className="input-multi-select"
          placeholder="choose..."
          style={{
            width: "200px",
          }}
          defaultValue={item?.insurance_company_ids || insuranceCompany}
          onChange={(e) => {
            setIsUpdated(true);
            setInsuranceCompany(e);
            setValue("insurance_company_ids", e);
          }}
          data={isCompanys?.map((item) => ({
            value: item?.id,
            label: item?.title,
            custome_disabled:
              user.role === "insurance_company"
                ? item?.id !== user?.insurance_company?.id
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
          defaultValue={item?.phone}
          type="tel"
          readOnly={item?.new ? false : true}
          {...register(`phone`)}
        />
        <input
          onInput={(e) => setIsUpdated(true)}
          defaultValue={item?.email}
          type="email"
          {...register(`email`)}
        />
        <select
          onInput={(e) => {
            setIsUpdated(true);
            setRegionValue(e.target.value);
          }}
          defaultValue={
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
          onInput={(e) => setIsUpdated(true)}
          defaultValue={item?.office_address}
          {...register(`office_address`)}
        />
        <Select
          className="input-multi-select"
          style={{
            width: "120px",
          }}
          searchable
          value={`${
            cityValue ??
            isCitys.find(
              (options) => Number(options.id) === Number(item?.city_id)
            )?.id
          }`}
          onChange={(e) => {
            setIsUpdated(true);
            setCityValue(e);
          }}
          data={isCitys.map((item) => ({
            label: item.city_name,
            value: `${item.id}`,
          }))}
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
                  .patch(
                    `${_URL}/appraisal-companies/delete/${item.id}`,
                    getFormData({
                      delete: true,
                      update: "delete",
                    })
                  )
                  .then((res) => {
                    setIsLoading(false);
                    getAppraiserCompFC(dispatch, user, "/appraisal-companies");
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

export default function AppComps() {
  const GlobalState = useSelector((state) => state);
  const dispatch = useDispatch();
  const [elements, setElements] = React.useState([...GlobalState?.appComp]);
  const [isCompanys, setIsCompanys] = React.useState([]);
  const isCitys = useSelector(({ city }) => city?.city);
  const user = useSelector(({ user }) => user);

  const isRegions = useSelector(({ region }) => region?.region);

  const [filteredData, setFilteredData] = React.useState([]);
  const [inputText, setInputText] = React.useState("");

  React.useEffect(() => {
    if (user.role === "appraisal_company") {
      setElements([user.appraisal_company]);
    } else setElements([...GlobalState?.appComp]);
  }, [user, GlobalState?.appComp]);

  React.useEffect(() => {
    setIsCompanys(GlobalState?.insuredCmp?.insuredCompanies);
  }, [GlobalState?.insuredCmp?.insuredCompanies, user]);

  const Form = useCallback(() => {
    return (
      inputText?.length
        ? filteredData
        : elements?.filter((resp) => !resp.delete)
    )
      .sort((a, b) => {
        if (a?.id > b?.id) return -1;
        if (a?.id < b?.id) return 1;
        return 0;
      })
      .sort((a, b) => Number(b.authentification) - Number(a.authentification))
      .map((item, i) => (
        <Rows
          key={item?.id ?? i}
          item={item}
          setElements={setElements}
          datas={elements}
          isCompanys={isCompanys}
          isRegions={isRegions}
          isCitys={isCitys}
          dispatch={dispatch}
          user={user}
        />
      ));
  }, [
    user,
    isRegions,
    isCitys,
    elements,
    inputText,
    filteredData,
    isCompanys,
    dispatch,
  ]);

  return (
    <>
      <Header height={60} p="xs">
        {user.role !== "appraisal_company" && (
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
                    setElements(elements?.concat([{ new: true }])?.reverse());
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
                data={elements?.filter((resp) => !resp.delete)}
                setFilteredData={setFilteredData}
                setInputText={setInputText}
                type={[
                  "appraisal_company_name",
                  "oao_ie_number",
                  "phone",
                  "email",
                ]}
              />
            </Grid.Col>
          </Grid>
        )}
      </Header>
      <div
        className="ox-scroll"
        style={{ minHeight: "max-content", overflow: "hidden" }}
      >
        <div className="row">
          <input
            className="disabled"
            readOnly={true}
            value={"auth"}
            style={{ width: "50px" }}
          />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"appraisal_company_name"}
          />
          <input className="disabled" readOnly={true} value={"oao_ie_number"} />
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
        <Form />
      </div>
    </>
  );
}
