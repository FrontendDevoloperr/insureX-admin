import React from "react";
import {
  LoadingOverlay,
  Header,
  ActionIcon,
  Grid,
  Checkbox,
  MultiSelect,
} from "@mantine/core";
import axios from "axios";
import { getFormData, _URL } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PlusUser } from "../icons";
import { Trash } from "tabler-icons-react";
import { useSelector, useDispatch } from "react-redux";
import SearchComponent from "../ui/search";
import { getAppraiser } from "../redux/reducer/appraiser";

function Rows({
  item,
  setElements,
  datas,
  isCompanys,
  isRegions,
  appraiselCompanys,
  user,
}) {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [isChecked, setIsChecked] = React.useState(item?.authentification);
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [appraisalCompany, setAppraisalCompany] = React.useState(
    item?.appraisers_company_id
  );

  const [insurance_company_ids, setInsurance_company_ids] = React.useState(
    item?.insurance_company_persons_id
  );

  const onSubmit = (data) => {
    data = { ...data, id: item.id };

    data.appraisers_company_id = appraisalCompany;
    data.insurance_company_persons_id =
      insurance_company_ids ?? item?.insurance_company_persons_id;
    !data?.appraisal_company_id &&
      (data.appraisal_company_id =
        item?.appraisal_company_id ?? appraiselCompanys[0]?.id);
    !data?.insurance_company_id &&
      (data.insurance_company_id =
        item?.insurance_company_id ?? isCompanys[0]?.id);
    !data?.region_id && (data.region_id = item?.region_id ?? isRegions[0]?.id);

    if (data?.id) {
      const formData = { ...data, role: "appraiser" };
      delete formData.id;

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
    if (item?.new) {
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

  const getAppraiserFC = () => {
    axios.get(`${_URL}/appraisers`).then(({ data }) => {
      dispatch(
        getAppraiser(data?.message?.appraisers?.filter((item) => !item?.delete))
      );
    });
  };

  const patchAutification = (data) => {
    const formData = {
      authentification: !isChecked,
    };
    setIsLoading(true);
    axios
      .patch(`${_URL}/appraisers/${item?.id}`, getFormData(formData))
      .then(({ data }) => {
        setIsLoading(false);
        setIsChecked(!isChecked);
        getAppraiserFC();
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
        {/* <select
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
        </select> */}

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
              user.role === "appraisal_company"
                ? item?.id !== user?.appraisal_company?.id
                  ? "true"
                  : "false"
                : "",
          }))}
          transition="pop-top-left"
          transitionDuration={80}
          transitionTimingFunction="ease"
        />

        {/* <select
          onInput={(e) => setIsUpdated(true)}
          defaultValue={
            appraiselCompanys?.find(
              (options) => options?.id === item?.appraisal_company_id,
            )?.id
          }
          {...register(`appraisal_company_id`)}
        >
          {appraiselCompanys?.map((options) => (
            <option key={options?.id} value={options?.id}>
              {options?.appraisal_company_name}
            </option>
          ))}
        </select> */}

        <MultiSelect
          className="input-multi-select"
          placeholder="choose..."
          style={{
            width: "200px",
          }}
          defaultValue={item?.appraisers_company_id}
          onChange={(e) => {
            setIsUpdated(true);
            setAppraisalCompany(e);
          }}
          data={appraiselCompanys?.map((item) => ({
            value: item?.id,
            label: item?.appraisal_company_name,
            custome_disabled:
              user.role === "appraisal_company"
                ? item?.id !== user.appraisal_companies.id
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
          defaultValue={item?.first_name}
          {...register(`first_name`)}
        />
        <input
          onInput={(e) => setIsUpdated(true)}
          defaultValue={item?.second_name}
          {...register(`second_name`)}
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
          defaultValue={item?.passport_id}
          readOnly={item?.new ? false : true}
          {...register(`passport_id`)}
        />
        <input
          onInput={(e) => setIsUpdated(true)}
          defaultValue={item?.email}
          type="email"
          {...register(`email`)}
        />
        <select
          onInput={(e) => setIsUpdated(true)}
          value={
            isRegions?.find((options) => options.id === item?.region_id)?.id
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
          onInput={(e) => setIsUpdated(true)}
          defaultValue={item?.address}
          {...register(`address`)}
        />
        {isUpdated ? (
          <button type="submit">{item?.id ? "Update" : "Create"}</button>
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
                    `${_URL}/appraisers/${item.id}`,
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
  const [isRegions, setIsRegions] = React.useState([]);
  const [appraiselCompanys, setAppraiselCompanys] = React.useState([]);
  const user = useSelector((state) => state.user);
  const GlobalState = useSelector((state) => state);
  const [filteredData, setFilteredData] = React.useState([]);
  const [inputText, setInputText] = React.useState("");

  React.useInsertionEffect(() => {
    if (user.role === "superadmin") {
      setElements(GlobalState?.appraiser?.appraiser);
    }
    if (user.role === "insurance_company") {
      setElements(
        GlobalState?.appraiser?.appraiser?.filter(
          (res) =>
            Number(res?.insurance_company_id) ===
            Number(user.insurance_company.id)
        )
      );
    }
    if (user.role === "appraisal_company") {
      setElements(
        GlobalState?.appraiser?.appraiser?.filter(
          (res) =>
            Number(res?.appraisal_company_id) ===
            Number(user.appraisal_company.id)
        )
      );
    }
  }, [GlobalState]);

  React.useInsertionEffect(() => {
    if (user.role === "superadmin" || user.role === "appraisal_company") {
      axios.get(`${_URL}/insurance-companies?delete=false`).then((res) => {
        setIsCompanys(
          res?.data?.message?.insurance_companies?.filter(
            (item) => !item?.delete
          )
        );
      });
    }
    if (user.role === "insurance_company") {
      setIsCompanys(
        [user.insurance_company] // res?.data?.message?.insurance_companies
      );
    }
    if (user.role === "superadmin" || user.role === "insurance_company") {
      axios.get(`${_URL}/appraisal-companies?delete=false`).then((res) => {
        setAppraiselCompanys(res?.data?.message?.appraisal_companies);
      });
    } else setAppraiselCompanys([user.appraisal_company]);
    axios.get(`${_URL}/regions`).then((res) => {
      setIsRegions(res?.data?.message?.regions);
    });
  }, [GlobalState]);

  return (
    <>
      <Header height={60} p="xs">
        <Grid>
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
                "first_name",
                "second_name",
                "phone",
                "passport_id",
                "email",
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
          <input
            className="disabled"
            readOnly={true}
            value={"auth"}
            style={{ width: "50px" }}
          />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"insurance_company "}
            style={{
              width: "200px",
            }}
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
              appraiselCompanys={appraiselCompanys}
              user={user}
            />
          ))}
      </div>
    </>
  );
}
