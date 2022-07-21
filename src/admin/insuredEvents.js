import React from "react";
import { LoadingOverlay, Header, ActionIcon } from "@mantine/core";
import axios from "axios";
import { _URL, getFormData, CaseTypeExtract, typeCase } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GoogDriveIcon, PlusUser } from "../icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Trash } from "tabler-icons-react";

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
  region,
}) {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(loading);
  const [appCom, setAppCom] = React.useState(
    appComp?.find(
      (app) =>
        app?.id ===
        events?.find((eve) => eve?.id === item?.insured_event_id)
          ?.appraisal_company_id
    )?.id
  );
  const [appraiser, setAppraiser] = React.useState(
    appraisers?.find((_app) => _app?.id === item?.appraiser_id)?.id
  );
  const [sdpId, setSdpId] = React.useState(
    sdp?.filter((options) => options.id === item?.sdp_id)[0]?.id
  );
  const [agent, setAgent] = React.useState(
    agents.find((options) => options.id === item?.agent_id)?.id
  );
  const [personId, setPersonId] = React.useState(
    person.find((_person) => _person?.id === item?.insured_person_id)
      ?.first_name
  );
  const [insComp, setiInsComp] = React.useState(
    events?.find((eve) => eve?.id === item?.insured_event_id)
      ?.insurance_company_id
  );
  const [isCity, setIsCity] = React.useState(
    isCitys.find((options) => options.id === item?.city_id)?.id
  );
  const [regionId, setRegionId] = React.useState(
    region.find((options) => options.id === item?.region_id)?.id
  );
  const [typeCaseIds, setTypeCaseIds] = React.useState(
    JSON.stringify({
      event_type_id: item?.event_type_id,
      property_type_id: item?.property_type_id,
    })
  );

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    let formData = {
      insured_person_id: item.insured_person_id ?? person[0].id,
      address: data.address,
      insured_number: data.insured_number,
      city_id: item.city_id ?? isCitys[0]?.id,
      agent_id: item.agent_id ?? agents[0].id,
      appraiser_id: item.appraiser_id ?? appraisers[0].id,
      sdp_id: item.sdp_id ?? sdp[0].id,
      event_type_id: item.event_type_id ?? 1,
      property_type_id: item.property_type_id ?? 1,
      document_date: item?.document_date ?? new Date().toISOString(),
    };

    let eventFormData = {
      insurance_company_id: item.insurance_company_id ?? isCompanys[0]?.id,
      insured_person_id: item.insured_person_id ?? person[0]?.id,
      region_id: item.region_id ?? region[0]?.id,
      address: item.address,
      date: item?.document_date ?? new Date().toISOString(),
      agent_id: item.agent_id ?? agents[0]?.id,
      appraisal_company_id:
        data?.appraisal_company_id ??
        events.find((eve) => eve?.id === item?.insured_event_id)
          ?.appraisal_company_id ??
        appComp[0]?.id,
      appraiser_id: item.appraiser_id ?? appraisers[0]?.id,
    };

    if (data?.id) {
      delete formData.id;
      setIsLoading(true);
      axios
        .patch(`${_URL}/insurance-case/${item?.id}`, getFormData(formData), {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
        .then((res) => {
          setIsLoading(false);
          toast.success("Updated");
          setIsUpdated(false);
          axios
            .patch(
              `${_URL}/insured-events/${item?.insured_event_id}`,
              getFormData(eventFormData),
              {
                headers: {
                  Authorization: `Bearer ${
                    JSON.parse(
                      localStorage.getItem("admin-panel-token-insure-x")
                    ).token
                  } `,
                },
              }
            )
            .then((res) => {
              console.log("success");
            })
            .catch((err) => {
              console.log(err);
              // toast.error("Error updating event");
            });
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
        .post(`${_URL}/insurance-case`, getFormData(formData), {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
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
      {events && (
        <form className="row" onSubmit={handleSubmit(onSubmit)}>
          <LoadingOverlay visible={isLoading} />

          <select
            onInput={(e) => {
              setIsUpdated(true);
              item.appraisal_company_id = e.target.value;
              setAppCom(e.target.value);
            }}
            value={
              appCom ??
              appComp?.find(
                (app) =>
                  app?.id ===
                  events?.find((eve) => eve?.id === item?.insured_event_id)
                    ?.appraisal_company_id
              )?.id
            }
            {...register(`appraisal_company_id`)}
          >
            <option  style={{display:"none"}}>choose...</option>
            {appComp?.map((options) => (
              <option key={options?.id} value={options?.id}>
                {options?.appraisal_company_name}
              </option>
            ))}
          </select>

          <select
            onInput={(e) => {
              setIsUpdated(true);
              item.appraiser_id = e.target.value;
              setAppraiser(e.target.value);
            }}
            value={
              appraiser ??
              appraisers?.find((_app) => _app?.id === item?.appraiser_id)?.id
            }
            {...register(`appraiser_id`)}
          >
            <option  style={{display:"none"}}>choose...</option>
            {appraisers?.map((options) => (
              <option key={options?.id} value={options?.id}>
                {options?.first_name}
              </option>
            ))}
          </select>

          <select
            onInput={(e) => {
              setIsUpdated(true);
              item.sdp_id = e.target.value;
              setSdpId(e.target.value);
            }}
            value={
              sdpId ??
              sdp?.filter((options) => options.id === item?.sdp_id)[0]?.id
            }
            {...register(`sdp_id`)}
          >
            <option  style={{display:"none"}}>choose...</option>
            {sdp?.map((options) => (
              <option key={options?.id} value={options?.id}>
                {options?.first_name}
              </option>
            ))}
          </select>

          <select
            onInput={(e) => {
              setIsUpdated(true);
              item.agent_id = e.target.value;
              setAgent(e.target.value);
            }}
            value={
              agent ??
              agents.find((options) => options.id === item?.agent_id)?.id
            }
            {...register(`agent_id`)}
          >
            <option  style={{display:"none"}}>choose...</option>
            {agents.map((options) => (
              <option key={options?.id} value={options?.id}>
                {options?.first_name}
              </option>
            ))}
          </select>

          <input
            style={!item?.new && !isUpdated ? {} : { display: "none" }}
            readOnly={true}
            onFocus={() => {
              if (item?.insured_person_id) {
                navigate("/persons#" + item?.insured_person_id);
              }
            }}
            defaultValue={
              personId ??
              person.find((_person) => _person?.id === item?.insured_person_id)
                ?.first_name
            }
            {...register(`insured_person_id`)}
          />

          <select
            style={!item?.new && !isUpdated ? { display: "none" } : {}}
            onInput={(e) => {
              setIsUpdated(true);
              item.insured_person_id = e.target.value;
              setPersonId(e.target.value);
            }}
            value={
              personId ??
              person.find((_person) => _person?.id === item?.insured_person_id)
                ?.first_name
            }
          >
            <option  style={{display:"none"}}>choose...</option>
            {person?.map((options) => (
              <option key={options?.id} value={options?.id}>
                {options?.first_name}
              </option>
            ))}
          </select>
          <select
            onInput={(e) => {
              setIsUpdated(true);
              item.insurance_company_id = e.target.value;
              setiInsComp(e.target.value);
            }}
            value={
              insComp ??
              events?.find((eve) => eve?.id === item?.insured_event_id)
                ?.insurance_company_id
            }
            {...register(`insurance_company_id`)}
          >
            <option  style={{display:"none"}}>choose...</option>
            {isCompanys?.map((options) => (
              <option key={options.id} value={options.id}>
                {options.title}
              </option>
            ))}
          </select>
          <input
            onInput={(e) => {
              setIsUpdated(true);
              item.insured_number = e.target.value;
            }}
            defaultValue={item?.insured_number}
            {...register(`insured_number`)}
          />
          <input
            style={{
              width: "140px",
              maxHeight: "48.6px",
            }}
            onFocus={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.target.type = "date";
            }}
            onInput={(e) => {
              setIsUpdated(true);
              item.document_date = e.target.value;
            }}
            onMouseMove={(e) => {
              e.target.type = "date";
            }}
            onMouseLeave={(e) => {
              e.target.type = "text";
            }}
            defaultValue={item?.document_date}
            {...register(`document_date`)}
          />
          <input
            onInput={(e) => {
              setIsUpdated(true);
              item.address = e.target.value;
            }}
            defaultValue={item?.address}
            {...register(`address`)}
          />
          <select
            onInput={(e) => {
              setIsUpdated(true);
              item.city_id = e.target.value;
              setIsCity(e.target.value);
            }}
            value={
              isCity ??
              isCitys.find((options) => options.id === item?.city_id)?.id
            }
            {...register(`city_id`)}
          >
            <option  style={{display:"none"}}>choose...</option>
            {isCitys.map((options) => (
              <option key={options?.id} value={options?.id}>
                {options?.city_name}
              </option>
            ))}
          </select>
          <select
            onInput={(e) => {
              setIsUpdated(true);
              item.region_id = e.target.value;
              setRegionId(e.target.value);
            }}
            value={
              regionId ??
              region.find((options) => options.id === item?.region_id)?.id
            }
            {...register(`region_id`)}
          >
            <option  style={{display:"none"}}>choose...</option>
            {region?.map((options) => (
              <option key={options?.id} value={options?.id}>
                {options?.region_name}
              </option>
            ))}
          </select>
          <select
            onInput={(e) => {
              setIsUpdated(true);
              let value = JSON.parse(e.target.value ?? "{}");
              setTypeCaseIds(e.target.value);
              item.event_type_id = value.event_type_id;
              item.property_type_id = value.property_type_id;
            }}
            value={
              typeCaseIds ??
              JSON.stringify({
                event_type_id: item?.event_type_id,
                property_type_id: item?.property_type_id,
              })
            }
          >
            <option  style={{display:"none"}}>choose...</option>
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
          {events?.find((eve) => eve.id === item?.insured_event_id)
            ?.folder_google_drive_link && (
            <button
              className="btn-drive-link"
              type="button"
              onClick={() => {
                window.open(
                  `${
                    events?.filter(
                      (eve) => eve.id === item?.insured_event_id
                    )[0]?.folder_google_drive_link
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
                      `${_URL}/insurance-case/${item.id}`,
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
      )}
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
  const [region, setRegion] = React.useState([]);
  const user = useSelector((state) => state.user);

  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await axios
        .get(`${_URL}/insurance-case`, {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
        .then((res) => {
          setElements(res?.data?.message?.insurance_cases);
          setLoading(false);
          axios
            .get(
              `${_URL}/insured-events${
                user.role === "insurance_company"
                  ? `?insurance_company_id=${user.insurance_company.id}`
                  : user.role === "appraisal_company"
                  ? `?appraisal_company_id=${user.appraisal_company.id}`
                  : user.role === "superadmin" && ""
              }`,
              {
                headers: {
                  Authorization: `Bearer ${
                    JSON.parse(
                      localStorage.getItem("admin-panel-token-insure-x")
                    ).token
                  } `,
                },
              }
            )
            .then((__res) => {
              setEvents(__res?.data?.message?.insured_events);
            });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    axios
      .get(`${_URL}/insurance-companies`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
        setIsCompanys(res?.data?.message?.insurance_companies);
      });
    axios
      .get(`${_URL}/city`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
        setIsCitys(res?.data?.message?.cities);
      });
    axios
      .get(`${_URL}/regions`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
        setRegion(res?.data?.message?.regions);
      });
    axios
      .get(`${_URL}/agents/select`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
        setAgents(res?.data?.message?.agents);
      });
    axios
      .get(`${_URL}/insured-persons`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
        setPerson(res?.data?.message?.insured_persons);
      });
    axios
      .get(`${_URL}/sdp`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
        setSdp(res?.data?.message?.sdp);
      });
    axios
      .get(`${_URL}/appraisers`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
        setAppraiser(res?.data?.message?.appraisers);
      });

    axios
      .get(`${_URL}/appraisal-companies`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
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
          <input
            className="disabled"
            style={{
              width: "140px",
            }}
            readOnly={true}
            value={"document_date"}
          />
          <input className="disabled" readOnly={true} value={"address"} />
          <input className="disabled" readOnly={true} value={"city"} />
          <input className="disabled" readOnly={true} value={"region"} />
          <input className="disabled" readOnly={true} value={"event type"} />
        </div>

        {elements
          ?.filter(
            (_res) =>
              !_res.delete &&
              _res?.insured_event_id ===
                events.find((_eve) => _eve.id === _res?.insured_event_id)?.id
          )

          .map((item, i) => (
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
              region={region}
            />
          ))}
      </div>
    </>
  );
}
