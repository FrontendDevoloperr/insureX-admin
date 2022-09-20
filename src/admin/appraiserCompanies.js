import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Trash } from "tabler-icons-react";
import {
  LoadingOverlay,
  Header,
  ActionIcon,
  Grid,
  Checkbox,
} from "@mantine/core";
import axios from "axios";
import { _URL, getFormData } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PlusUser } from "../icons";

import SearchComponent from "../ui/search";
import { getAppraiserCompanies } from "../redux/reducer/appraiserComp";

function Rows({ item, setElements, datas, isCompanys, isRegions, isCitys }) {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [cityValue, setCityValue] = React.useState(
    isCitys.find((options) => Number(options.id) === Number(item?.city_id))?.id
  );
  const [isChecked, setIsChecked] = React.useState(item?.authentification);

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    !data.insurance_company_ids &&
      (data.insurance_company_ids = item?.insurance_company_ids?.[0]);
    !data.region_id && (data.region_id = item.region_id);
    data.city_id = !!data?.city_id.length ? data?.city_id : item?.city_id;
    if (data?.id) {
      let formData = {
        ...data,
        insurance_company_id: data.insurance_company_ids,
      };
      delete formData.id;
      delete formData.insurance_company_ids;
      setIsLoading(true);
      axios
        .patch(`${_URL}/appraisal-companies/${item?.id}`, getFormData(formData))
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
      data.passport_id = data?.oao_ie_number;
      data.role = "appraisal_company";
      axios
        .post(`${_URL}/appraisal-companies`, getFormData(data))
        .then((res) => {
          setIsLoading(false);
          setElements(
            [...datas, res?.data?.message?.appraiser].filter(
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

  const getAppraiserCompFC = () => {
    axios.get(`${_URL}/appraisal-companies`).then(({ data }) => {
      dispatch(
        getAppraiserCompanies(
          data?.message?.appraisal_companies?.filter((item) => !item?.delete)
        )
      );
    });
  };

  const patchAutification = (data) => {
    const formData = {
      authentification: !isChecked,
    };
    setIsLoading(true);
    axios
      .patch(`${_URL}/appraisal-companies/${item?.id}`, getFormData(formData))
      .then(({ data }) => {
        setIsLoading(false);
        setIsChecked(!isChecked);
        getAppraiserCompFC();
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
          defaultValue={item?.oao_ie_number}
          {...register(`oao_ie_number`)}
        />
        <select
          className="multiples-select"
          onInput={(e) => {
            e.target.value !== item?.insurance_company_ids?.[0]
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={
            isCompanys?.find(
              (resp) => resp?.id === item?.insurance_company_ids[0]
            )?.id
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
            e.target.value !== item?.region_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
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
          onInput={(e) => {
            e.target.value !== item?.office_address
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.office_address}
          {...register(`office_address`)}
        />
        {!isUpdated && (
          <input
            type="text"
            onMouseDown={() => setIsUpdated(true)}
            value={
              isCitys.find((options) => options.id === item?.city_id)
                ?.city_name ?? "Choose..."
            }
            readOnly={true}
          />
        )}
        {isUpdated && (
          <select
            onInput={(e) => {
              setIsUpdated(true);
              setCityValue(e.target.value);
            }}
            value={
              cityValue ??
              isCitys.find(
                (options) => Number(options.id) === Number(item?.city_id)
              )?.id
            }
            {...register(`city_id`)}
          >
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
              if (!item?.id) {
                setElements(datas.filter((item) => item?.new !== true));
              }
              if (item?.id) {
                setIsLoading(true);
                axios
                  .patch(
                    `${_URL}/appraisal-companies/${item.id}`,
                    getFormData({
                      delete: true,
                    })
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
  const [isCompanys, setIsCompanys] = React.useState([]);
  const [isCitys, setIsCitys] = React.useState([]);
  const user = useSelector((state) => state.user);
  const GlobalState = useSelector((state) => state);
  const isRegions = useSelector(({ region }) => region?.region);

  const [filteredData, setFilteredData] = React.useState([]);
  const [inputText, setInputText] = React.useState("");

  React.useEffect(() => {
    if (user.role === "superadmin") {
      setElements(GlobalState?.appComp);
    }

    if (user.role === "insurance_company") {
      setElements(
        GlobalState?.appComp?.filter((res) =>
          res?.insurance_company_ids?.includes(user.insurance_company.id)
        )
      );
    }
    if (user.role === "appraisal_company") {
      setElements([user.appraisal_company]);
    }
  }, [user.role, GlobalState]);

  React.useEffect(() => {
    if (user.role === "insurance_company") {
      setIsCompanys(
        [user.insurance_company] // res?.data?.message?.insurance_companies
      );
    }
    if (user.role === "superadmin" || user.role === "appraisal_company") {
      setIsCompanys(GlobalState?.insuredCmp?.insuredCompanies);
    }
    setIsCitys(GlobalState?.city?.city);
  }, [GlobalState]);

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
        {(inputText?.length
          ? filteredData
          : elements?.filter((resp) => !resp.delete)
        )
          .sort(
            (a, b) => Number(b.authentification) - Number(a.authentification)
          )
          .map((item, i) => (
            <Rows
              key={item?.id ?? i}
              item={item}
              setElements={setElements}
              datas={elements}
              isCompanys={isCompanys}
              isRegions={isRegions}
              isCitys={isCitys}
            />
          ))}
      </div>
    </>
  );
}
