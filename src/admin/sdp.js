import React from "react";
import {
  LoadingOverlay,
  Header,
  ActionIcon,
  Grid,
  Checkbox,
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

function Rows({ item, isCompanys, isCitys, dispatch }) {
  const { register, handleSubmit } = useForm();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(item?.authentification);

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
        .patch(`${_URL}/sdp/${item?.id}`, getFormData(formData))
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
        .post(`${_URL}/sdp`, getFormData(data))
        .then((res) => {
          setIsLoading(false);
          getSdpFC(dispatch);
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

  const getSdpFC = (dispatch) => {
    axios.get(`${_URL}/sdp`).then(({ data }) => {
      dispatch(getSdp(data?.message?.sdp?.filter((item) => !item?.delete)));
    });
  };

  const patchAutification = (data) => {
    const formData = {
      authentification: !isChecked,
    };
    setIsLoading(true);
    axios
      .patch(`${_URL}/sdp/${item?.id}`, getFormData(formData))
      .then(({ data }) => {
        setIsLoading(false);
        setIsChecked(!isChecked);
        getSdpFC();
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
      <select
        className=""
        onInput={() => setIsUpdated(true)}
        defaultValue={
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
        disabled={item?.new ? false : true}
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

      {isUpdated && (
        <select
          onInput={(e) => {
            setIsUpdated(true);
          }}
          value={isCitys?.find((options) => options?.id === item?.city_id)?.id}
          {...register(`city_id`)}
        >
          {isCitys?.map((options) => (
            <option
              // selected={options.id === item?.city_id}
              key={options?.id}
              value={options?.id}
            >
              {options?.city_name}
            </option>
          ))}
        </select>
      )}
      {!isUpdated && (
        <input
          type="text"
          onMouseDown={() => setIsUpdated(true)}
          value={
            isCitys?.find((options) => options?.id === item?.city_id)?.city_name
          }
          readOnly
        />
      )}
      <input
        onInput={(e) => {
          e.target.value !== item?.address
            ? setIsUpdated(true)
            : setIsUpdated(false);
        }}
        defaultValue={item?.address}
        {...register(`address`)}
        className=""
      />
      <input
        onInput={(e) => {
          e.target.value !== item?.passport_id
            ? setIsUpdated(true)
            : setIsUpdated(false);
        }}
        defaultValue={item?.passport_id}
        disabled={item?.new ? false : true}
        {...register(`passport_id`)}
      />

      <select
        onInput={(e) => {
          setIsUpdated(true);
        }}
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
              getSdpFC(dispatch);
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
                  getSdpFC(dispatch);
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
  const elements = useSelector(({ sdp }) => sdp?.sdp);
  const user = useSelector((state) => state.user);
  const isCitys = useSelector(({ city }) => city.city);
  const isCompanys = useSelector(
    ({ insuredCmp }) => insuredCmp?.insuredCompanies
  );
  const [filteredData, setFilteredData] = React.useState([]);
  const [inputText, setInputText] = React.useState("");

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
              data={elements?.filter((resp) =>
                !resp.delete && user.role === "insurance_company"
                  ? !resp.insurance_company_id === user?.insurance_company?.id
                  : resp
              )}
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
            className="disabled "
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
        {(inputText?.length
          ? filteredData
          : elements?.filter((resp) =>
              !resp.delete && user.role === "insurance_company"
                ? !resp.insurance_company_id === user?.insurance_company?.id
                : resp
            )
        )
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
            />
          ))}
      </div>
    </>
  );
}
