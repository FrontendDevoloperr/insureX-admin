import React from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { _URL, getFormData } from "../utils";
import {
  LoadingOverlay,
  Header,
  ActionIcon,
  Grid,
  Checkbox,
} from "@mantine/core";
import { PlusUser } from "../icons";
import { Trash } from "tabler-icons-react";
import { getInsuredCompanies } from "../redux/reducer/insuredCompanies";
import SearchComponent from "../ui/search";

function Rows({ item, datas, dispatch }) {
  const { register, handleSubmit } = useForm();
  const [isChecked, setIsChecked] = React.useState(item?.authentification);
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    if (data?.id) {
      let formData = {
        ...data,
        insurance_company_id: data.insurance_company_ids,
      };
      delete formData.id;
      delete formData.insurance_company_ids;
      setIsLoading(true);
      axios
        .patch(
          `${_URL}/insurance-companies/${item?.id}`,
          getFormData(formData),
          
        )
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
      data.passport_id = data.ie_number;
      data.role = "insurance_company";
      axios
        .post(`${_URL}/insurance-companies`, getFormData(data))
        .then((res) => {
          setIsLoading(false);
          dispatch(
            getInsuredCompanies(
              [...datas, res?.data?.message?.insurance_company].filter(
                (item) => !item?.new
              )
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

  const getInsuredCompaniesFC = () => {
    axios
      .get(`${_URL}/insurance-companies`)
      .then(({ data }) => {
        dispatch(
          getInsuredCompanies(
            data?.message?.insurance_companies?.filter((item) => !item?.delete)
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const patchAutification = (data) => {
    const formData = {
      authentification: !isChecked,
    };
    setIsLoading(true);
    axios
      .patch(`${_URL}/insurance-companies/${item?.id}`, getFormData(formData))
      .then(({ data }) => {
        setIsLoading(false);
        setIsChecked(!isChecked);
        getInsuredCompaniesFC();
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
          defaultValue={item?.title}
          {...register(`title`)}
        />
        <input
          className="multiples-select"
          onInput={(e) => {
            setIsUpdated(true);
          }}
          defaultValue={item?.ie_number}
          {...register(`ie_number`)}
        />

        <input
          className="multiples-select"
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
          className="multiples-select"
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
          className="multiples-select"
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
                dispatch(
                  getInsuredCompanies(
                    datas?.filter((item) => item?.new !== true)
                  )
                );
              }
              if (item?.id) {
                setIsLoading(true);
                axios
                  .patch(
                    `${_URL}/insurance-companies/${item.id}`,
                    getFormData({
                      delete: true,
                    })
                  )
                  .then((res) => {
                    setIsLoading(false);
                    dispatch(
                      getInsuredCompanies(
                        datas.filter((__res) => __res?.id !== item?.id)
                      )
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
  const user = useSelector(({ user }) => user);
  let companies = useSelector(({ insuredCmp }) => insuredCmp?.insuredCompanies);

  const [filteredData, setFilteredData] = React.useState([]);
  const [inputText, setInputText] = React.useState("");
  const [elements, setElements] = React.useState(companies);

  React.useEffect(() => {
    if (user?.role === "insurance_company") {
      setElements([user?.insurance_company]);
      return;
    }
    setElements(companies);
  }, [user?.role, companies]);

  return (
    <>
      <Header height={60} p="xs">
        {user.role === "superadmin" && (
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
                      getInsuredCompanies(
                        elements?.concat([{ new: true }])?.reverse()
                      )
                    );
                    toast.success("You can fill in a new entry");
                  }
                }}
              >
                <span>Add</span>
                <PlusUser color={"#fff"} />
              </button>
            </Grid.Col>
            <Grid.Col span={3}>
              <SearchComponent
                data={elements}
                setFilteredData={setFilteredData}
                setInputText={setInputText}
                type={["title", "email", "ie_number", "phone"]}
              />
            </Grid.Col>
          </Grid>
        )}
      </Header>
      <div className="ox-scroll">
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
            value={"title"}
          />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"ie_number"}
          />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"email"}
          />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"phone"}
          />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"address"}
          />
        </div>
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
              datas={elements}
              dispatch={dispatch}
            />
          ))}
      </div>
    </>
  );
}
