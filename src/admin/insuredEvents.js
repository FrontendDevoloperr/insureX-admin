import React from "react";
import { LoadingOverlay, Header } from "@mantine/core";
import axios from "axios";
import { _URL, getFormData, CaseTypeExtract, typeCase } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GoogDriveIcon, PlusUser } from "../icons";
import { useNavigate } from "react-router-dom";

function Rows({
  item,
  setElements,
  datas,
  loading,
  isCompanys,
  isCitys,
  agents,
  person,
  sdp,
  appraisers,
  events,
  appComp,
}) {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(loading);

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    !data.city_id && item.city_id
      ? (data.city_id = item.city_id)
      : (data.city_id = isCitys[0]?.id);
    !data.appraiser_id && item.appraiser_id
      ? (data.appraiser_id = item.appraiser_id)
      : (data.appraiser_id = appraisers[0]?.id);
    let formData = {
      insured_person_id: item.insured_person_id ?? person[0].id,
      address: data.address,
      document_date: item.document_date ?? data.document_date,
      insured_number: data.insured_number,
      city_id: item.city_id ?? isCitys[0]?.id,
      agent_id: item.agent_id ?? agents[0].id,
      appraiser_id: item.appraiser_id ?? appraisers[0].id,
      sdp_id: item.sdp_id ?? sdp[0].id,
      event_type_id: item.event_type_id ?? 1,
      property_type_id: item.property_type_id ?? 1,
    };
    if (data?.id) {
      delete formData.id;
      setIsLoading(true);
      axios
        .patch(`${_URL}/insurance-case/${item?.id}`, getFormData(formData))
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
        .post(`${_URL}/insurance-case`, getFormData(formData))
        .then((res) => {
          setIsLoading(false);
          setElements(
            [...datas, res?.data?.message?.insurance_case].filter(
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

  return (
    <>
      <form className="row" onSubmit={handleSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoading} />

        <select
          onInput={(e) => {
            e.target.value !== item?.appraisal_company_name
              ? setIsUpdated(true)
              : setIsUpdated(false);

            item.appraisal_company_name = e.target.value;
          }}
          value={
            appComp?.filter(
              (app) =>
                app?.id ===
                events?.filter((eve) => eve.id === item?.insured_event_id)[0]
                  ?.appraisal_company_id
            )[0]?.appraisal_company_name
          }
          {...register(`appraisal_company_name`)}
        >
          {appComp?.map((options) => (
            <option key={options?.id} value={options?.appraisal_company_name}>
              {options?.appraisal_company_name}
            </option>
          ))}
        </select>

        <select
          onInput={(e) => {
            e.target.value !== item?.appraiser_id
              ? setIsUpdated(true)
              : setIsUpdated(false);

            item.appraiser_id = e.target.value;
          }}
          value={
            appraisers?.find((_app) => _app?.id === item?.appraiser_id)?.id
          }
          {...register(`appraiser_id`)}
        >
          {appraisers?.map((options) => (
            <option key={options?.id} value={options?.id}>
              {options?.first_name}
            </option>
          ))}
        </select>

        <select
          onInput={(e) => {
            e.target.value !== item?.sdp_id
              ? setIsUpdated(true)
              : setIsUpdated(false);

            item.sdp_id = e.target.value;
          }}
          value={sdp?.filter((options) => options.id === item?.sdp_id)[0]?.id}
          {...register(`sdp_id`)}
        >
          {sdp?.map((options) => (
            <option key={options?.id} value={options?.id}>
              {options?.first_name}
            </option>
          ))}
        </select>

        <select
          onInput={(e) => {
            e.target.value !== item?.agent_id
              ? setIsUpdated(true)
              : setIsUpdated(false);

            item.agent_id = e.target.value;
          }}
          value={
            agents.filter((options) => options.id === item?.agent_id)[0]?.id
          }
          {...register(`agent_id`)}
        >
          {agents.map((options) => (
            <option key={options?.id} value={options?.id}>
              {options?.first_name}
            </option>
          ))}
        </select>

        {!item?.new ? (
          <input
            onFocus={() => {
              if (item?.insured_person_id) {
                navigate("/persons#" + item?.insured_person_id);
              }
            }}
            defaultValue={
              person.find((_person) => _person?.id === item?.insured_person_id)
                ?.first_name
            }
            {...register(`insured_person_id`)}
          />
        ) : (
          <select
            onInput={(e) => {
              e.target.value !== item?.insured_person_id
                ? setIsUpdated(true)
                : setIsUpdated(false);

              item.insured_person_id = e.target.value;
            }}
            value={person.find((_person) => _person?.id === "344")?.id}
            {...register(`insured_person_id`)}
          >
            {person?.map((options) => (
              <option key={options?.id} value={options?.id}>
                {options?.first_name}
              </option>
            ))}
          </select>
        )}
        <select
          onInput={(e) => {
            e.target.value !== item?.insurance_company_id?.[0]
              ? setIsUpdated(true)
              : setIsUpdated(false);
            item.insurance_company_id = e.target.value;
          }}
          value={
            isCompanys?.filter(
              (options) => options.id === item?.insurance_company_id?.[0]
            )[0]?.id ?? isCompanys[0]?.id
          }
          {...register(`insurance_company_id`)}
        >
          {isCompanys?.map((options) => (
            <option key={options.id} value={options.id}>
              {options.title}
            </option>
          ))}
        </select>
        <input
          onInput={(e) => {
            e.target.value !== item?.insured_number
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.insured_number}
          {...register(`insured_number`)}
        />
        <input
          onInput={(e) => {
            e.target.value !== item?.document_date
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.document_date}
          {...register(`document_date`)}
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
            e.target.value !== item?.city_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
            item.city_id = e.target.value;
          }}
          value={
            isCitys.filter((options) => options.id === item?.city_id)[0]?.id
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

        <select
          onInput={(e) => {
            setIsUpdated(true);
            let value = JSON.parse(e.target.value ?? "{}");
            item.event_type_id = value.event_type_id;
            item.property_type_id = value.property_type_id;
            console.log(item);
          }}
          defaultValue={
            JSON.stringify({
              event_type_id: CaseTypeExtract(item)?.event_type_id,
              property_type_id: CaseTypeExtract(item)?.property_type_id,
            })
          }
        >
          {typeCase?.map((options) => (
            <option
              key={options?.link}
              value={JSON.stringify({
                event_type_id: options?.event_type_id,
                property_type_id: options?.property_type_id,
              })}
            >
              {CaseTypeExtract(options)?.name}
            </option>
          ))}
        </select>
        {events?.filter((eve) => eve.id === item?.insured_event_id)[0]
          ?.folder_google_drive_link && (
          <button
            className="btn-drive-link"
            type="button"
            onClick={() => {
              window.open(
                `${
                  events?.filter((eve) => eve.id === item?.insured_event_id)[0]
                    ?.folder_google_drive_link
                }`,
                "_blank",
                "noopener",
                "noreferrer"
              );
            }}
          >
            <GoogDriveIcon />
          </button>
        )}
        {isUpdated ? (
          <button type="submit" onClick={() => {}}>
            {item?.id ? "Update" : "Create"}
          </button>
        ) : (
          ""
        )}
      </form>
    </>
  );
}

export default function Persons() {
  const [elements, setElements] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isCompanys, setIsCompanys] = React.useState([]);
  const [isCitys, setIsCitys] = React.useState([]);
  const [agents, setAgents] = React.useState([]);
  const [person, setPerson] = React.useState([]);
  const [sdp, setSdp] = React.useState([]);
  const [appraiser, setAppraiser] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [appComp, setAppComp] = React.useState([]);

  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await axios
        .get(`${_URL}/insurance-case`)
        .then((res) => {
          setElements(res?.data?.message?.insurance_cases);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast.error("Error loading data, looks like a server error");
        });
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    axios.get(`${_URL}/insurance-companies`).then((res) => {
      setIsCompanys(res?.data?.message?.insurance_companies);
    });
    axios.get(`${_URL}/city`).then((res) => {
      setIsCitys(res?.data?.message?.cities);
    });
    axios.get(`${_URL}/agents`).then((res) => {
      setAgents(res?.data?.message?.agents);
    });
    axios.get(`${_URL}/insured-persons`).then((res) => {
      setPerson(res?.data?.message?.insured_persons);
    });
    axios.get(`${_URL}/sdp`).then((res) => {
      setSdp(res?.data?.message?.sdp);
    });
    axios.get(`${_URL}/appraisers`).then((res) => {
      setAppraiser(res?.data?.message?.appraisers);
    });
    axios.get(`${_URL}/insured-events`).then((res) => {
      setEvents(res?.data?.message?.insured_events);
    });
    axios.get(`${_URL}/appraisal-companies`).then((res) => {
      setAppComp(res?.data?.message?.appraisal_companies);
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
          <input
            className="disabled "
            readOnly={true}
            value={"appraisal_company_name"}
          />
          <input className="disabled" readOnly={true} value={"appraiser"} />
          <input className="disabled" readOnly={true} value={"sdp"} />
          <input className="disabled" readOnly={true} value={"agent"} />
          <input
            className="disabled"
            readOnly={true}
            value={"insured_person"}
          />
          <input
            className="disabled "
            readOnly={true}
            value={"insurance_company_id"}
          />
          <input
            className="disabled"
            readOnly={true}
            value={"insured_number"}
          />
          <input className="disabled" readOnly={true} value={"document_date"} />
          <input className="disabled" readOnly={true} value={"address"} />
          <input className="disabled" readOnly={true} value={"city"} />
          <input className="disabled" readOnly={true} value={"event type"} />
        </div>
        {elements?.map((item, i) => (
          <Rows
            key={item?.id ?? i}
            item={item}
            setElements={setElements}
            datas={elements}
            loading={loading}
            isCompanys={isCompanys}
            isCitys={isCitys}
            agents={agents}
            person={person}
            sdp={sdp}
            appraisers={appraiser}
            events={events}
            appComp={appComp}
          />
        ))}
      </div>
    </>
  );
}
