import React, { useEffect } from "react";
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
import { _URL, getFormData, supplier_types } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PlusUser } from "../icons";
import { Trash } from "tabler-icons-react";
import { useSelector, useDispatch } from "react-redux";
import { getSdp } from "../redux/reducer/sdp";
import SearchComponent from "../ui/search";
import { getSdpFC } from "../utils/request";

function Rows({ item, isCompanys, isCitys, dispatch, user }) {
  const { register, handleSubmit } = useForm();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(item?.authentification);
  const [cityValue, setCityValue] = React.useState(
    isCitys.find((options) => Number(options.id) === Number(item?.city_id))?.id
  );
  const [insurance_company_ids, setInsurance_company_ids] = React.useState(
    item?.insurance_company_ids
  );

  const onSubmit = (data) => {
    if (!insurance_company_ids[0] || !cityValue)
      return toast.error("Please select insurance_company");
    data = { ...data, id: item.id };
    data.insurance_company_ids = `{${insurance_company_ids}}`;
    data.city_id = cityValue;
    if (data?.id) {
      let formData = { ...data, role: "sdp" };
      delete formData.id;
      setIsLoading(true);
      axios
        .patch(`${_URL}/sdp/${item?.id}`, getFormData(formData))
        .then((res) => {
          getSdpFC(dispatch, user, "/sdp");
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
        .post(`${_URL}/sdp`, getFormData(data))
        .then((res) => {
          setIsLoading(false);
          getSdpFC(dispatch, user, "/sdp");
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

  const patchAutification = (data) => {
    if (!item.id) return setIsChecked(false);
    const formData = {
      authentification: !isChecked,
    };
    setIsLoading(true);
    axios
      .patch(`${_URL}/sdp/${item?.id}`, getFormData(formData))
      .then(({ data }) => {
        getSdpFC(dispatch, user, "/sdp");
        setIsLoading(false);
        setIsChecked(!isChecked);
      })
      .catch((err) => {
        setIsChecked(isChecked);
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <form className="row" onSubmit={handleSubmit(onSubmit)}>
      <LoadingOverlay visible={isLoading} />
      <Checkbox
        type="checkbox"
        checked={isChecked}
        defaultValue={item?.authentification}
        onChange={patchAutification}
        className="checkbox_inp"
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
        defaultValue={item?.email}
        type="email"
        {...register(`email`)}
      />

      <Select
        className="input-multi-select"
        style={{
          width: "120px",
        }}
        searchable
        error={!cityValue}
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
      <input
        onInput={(e) => setIsUpdated(true)}
        defaultValue={item?.address}
        {...register(`address`)}
        className=""
      />
      <input
        onInput={(e) => setIsUpdated(true)}
        defaultValue={item?.passport_id}
        readOnly={item?.new ? false : true}
        {...register(`passport_id`)}
      />

      <select
        onInput={(e) => setIsUpdated(true)}
        defaultValue={
          supplier_types?.find((options) =>
            item?.supplier_type_ids?.includes(options?.id)
          )?.id
        }
        {...register(`supplier_type_ids`)}
      >
        {supplier_types?.map((options) => (
          <option key={options?.id} value={options?.id}>
            {options?.description}
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
              getSdpFC(dispatch, user, "/sdp");
            }
            if (item?.id) {
              setIsLoading(true);
              axios
                .patch(
                  `${_URL}/sdp/${item.id}`,
                  getFormData({
                    delete: true,
                  })
                )
                .then((res) => {
                  setIsLoading(false);
                  getSdpFC(dispatch, user, "/sdp");
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
  const dispatch = useDispatch();
  const sdps = useSelector(({ sdp }) => sdp?.sdp);
  const user = useSelector((state) => state.user);
  const isCitys = useSelector(({ city }) => city.city);
  const isCompanys = useSelector(
    ({ insuredCmp }) => insuredCmp?.insuredCompanies
  );
  const [elements, setElements] = React.useState([...sdps]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [inputText, setInputText] = React.useState("");

  useEffect(() => setElements([...sdps]), [sdps]);

  return (
    <>
      <Header height={60} p="xs">
        <Grid>
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
                    getSdp(elements?.concat([{ new: true }])?.reverse())
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
              data={elements}
              setFilteredData={setFilteredData}
              setInputText={setInputText}
              type={[
                "first_name",
                "second_name",
                "email",
                "phone",
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
          <input
            className="disabled"
            readOnly={true}
            value={"auth"}
            style={{ width: "50px" }}
          />
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
          <input className="disabled " readOnly={true} value={"address"} />
          <input className="disabled " readOnly={true} value={"login_id"} />
          <input
            className="disabled "
            readOnly={true}
            value={"supplier_type"}
          />
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
        {[...(inputText?.length ? filteredData : elements)]
          .sort((a, b) => {
            if (a?.id > b?.id) return -1;
            if (a?.id < b?.id) return 1;
            return 0;
          })
          .sort(
            (a, b) => Number(b.authentification) - Number(a.authentification)
          )
          .map((item, i) => (
            <Rows
              key={item?.id ?? i}
              item={item}
              getSdp={getSdp}
              datas={elements}
              isCompanys={isCompanys}
              isCitys={isCitys}
              dispatch={dispatch}
              user={user}
            />
          ))}
      </div>
    </>
  );
}
