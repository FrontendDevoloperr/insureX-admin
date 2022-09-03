import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { LoadingOverlay, Header, ActionIcon } from "@mantine/core";
import {
  _URL,
  getFormData,
  CaseTypeExtract,
  typeCase,
  StatusesData,
} from "../utils";
import toast from "react-hot-toast";
import { GoogDriveIcon, PlusUser } from "../icons";

import { Trash } from "tabler-icons-react";
import { setCases } from "../redux/reducer/cases";

function Rows({
  item,
  setElements,
  datas,
  isCompanys,
  isCitys,
  agents,
  person,
  sdp,
  appraisers,
  events,
  appComp,
  region,
  dispatch,
  loading,
  GlobalState,
}) {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [statustId, setStatustId] = React.useState(item?.status_id ?? 1);

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
    person.find((_person) => _person?.id === item?.insured_person_id)?.id
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
      insured_person_id: personId ?? item.insured_person_id ?? person[0].id,
      address: data.address,
      insured_number: data.insured_number,
      city_id: isCity ?? item.city_id ?? isCitys[0]?.id,
      agent_id: agent ?? item.agent_id ?? agents[0].id,
      appraiser_id: appraiser ?? item.appraiser_id ?? appraisers[0].id,
      sdp_id: sdpId ?? item.sdp_id ?? sdp[0].id,
      event_type_id:
        JSON.parse(typeCaseIds ?? "{}")?.event_type_id ??
        item.event_type_id ??
        1,
      property_type_id:
        JSON.parse(typeCaseIds ?? "{}")?.property_type_id ??
        item.property_type_id ??
        1,
      document_date: item?.document_date ?? new Date().toISOString(),
      statust_id: statustId ?? item.statust_id,
    };

    let eventFormData = {
      insurance_company_id:
        insComp ?? item.insurance_company_id ?? isCompanys[0]?.id,
      insured_person_id: personId ?? item.insured_person_id ?? person[0]?.id,
      region_id: regionId ?? item.region_id ?? region[0]?.id,
      address: item.address,
      date: data?.date ?? item?.document_date ?? new Date().toISOString(),
      agent_id: agent ?? item.agent_id ?? agents[0]?.id,
      appraisal_company_id:
        appCom ??
        data?.appraisal_company_id ??
        events.find((eve) => eve?.id === item?.insured_event_id)
          ?.appraisal_company_id ??
        appComp[0]?.id,
      appraiser_id: appraiser ?? item.appraiser_id ?? appraisers[0]?.id,
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
              SendAppraiserMessage(
                item?.appraiser_id,
                appraiser,
                personId,
                sdpId,
                typeCase?.find(
                  (tp) =>
                    tp.event_type_id ===
                      JSON.parse(typeCaseIds ?? "{}")?.event_type_id &&
                    tp.property_type_id ===
                      JSON.parse(typeCaseIds ?? "{}")?.property_type_id
                )?.name,
                GlobalState,
                item?.id
              );
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
          toast.success("Data uploaded, new users created");
          setIsUpdated(false);
          window.location.reload();
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
          <LoadingOverlay visible={isLoading || loading} />
          <select
            onInput={(e) => {
              setIsUpdated(true);
              item.appraisal_company_id = e.target.value;
              setAppCom(e.target.value);
            }}
            defaultValue={
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
            {appComp?.map((options) => (
              <option key={options?.id} value={options?.id}>
                {options?.appraisal_company_name}
              </option>
            ))}
          </select>

          <select
            onInput={(e) => {
              setIsUpdated(true);
              setAppraiser(e.target.value);
            }}
            defaultValue={
              appraiser ??
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
              setIsUpdated(true);
              item.sdp_id = e.target.value;
              setSdpId(e.target.value);
            }}
            defaultValue={
              sdpId ??
              sdp?.filter((options) => options.id === item?.sdp_id)[0]?.id
            }
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
              setIsUpdated(true);
              item.agent_id = e.target.value;
              setAgent(e.target.value);
            }}
            defaultValue={
              agent ??
              agents.find((options) => options.id === item?.agent_id)?.id
            }
            {...register(`agent_id`)}
          >
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
            value={
              person.find((_person) => _person?.id === personId)?.first_name
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
            defaultValue={
              // personId ??
              person.find((_person) => _person?.id === item?.insured_person_id)
                ?.first_name
            }
          >
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
            defaultValue={
              insComp ??
              events?.find((eve) => eve?.id === item?.insured_event_id)
                ?.insurance_company_id
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
            defaultValue={
              isCity ??
              isCitys.find((options) => options.id === item?.city_id)?.id
            }
            {...register(`city_id`)}
          >
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
            defaultValue={
              regionId ??
              region.find((options) => options.id === item?.region_id)?.id
            }
            {...register(`region_id`)}
          >
            {region?.map((options) => (
              <option key={options?.id} value={options?.id}>
                {options?.region_name}
              </option>
            ))}
          </select>
          <select
            onInput={(e) => {
              setIsUpdated(true);
              setTypeCaseIds(e.target.value);
            }}
            defaultValue={
              typeCaseIds ??
              JSON.stringify({
                event_type_id: item?.event_type_id,
                property_type_id: item?.property_type_id,
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
          <select
            onInput={(e) => {
              setStatustId(e.target.value);
              setIsUpdated(true);
            }}
            value={statustId}
          >
            {StatusesData?.map((options) => (
              <option
                key={options?.id}
                value={options?.id}
                hidden={
                  options?.id === 4
                    ? CaseTypeExtract(JSON.parse(typeCaseIds ?? "{}"))?.link !==
                      ("accident" || "carburglary")
                    : options?.id === 8
                    ? CaseTypeExtract(JSON.parse(typeCaseIds ?? "{}"))?.link !==
                      ("accident" || "carburglary")
                    : options?.id === 9 &&
                      CaseTypeExtract(JSON.parse(typeCaseIds ?? "{}"))?.link !==
                        ("accident" || "carburglary")
                }
              >
                {options?.description}
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
                  dispatch(
                    setElements(datas.filter((item) => item?.new !== true))
                  );
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
                      dispatch(
                        setElements(
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
      )}
    </>
  );
}

function SendAppraiserMessage(
  id,
  changeId,
  customer,
  sdp,
  nameEvent,
  GlobalState,
  caseID
) {
  if (!caseID || !GlobalState || id === changeId) return;
  let msAppraiser51 = (
    nameSdp,
    nameCustomer,
    numberEvent,
    nameEvent,
    nameAppraiser
  ) =>
    `${nameSdp} קבע שיחת וידאו עם ${nameCustomer} ע"י ${numberEvent} מס' ${nameEvent} נפתח אירוע ${nameAppraiser} שלום `;

  let formData = {
    type: `admin-${GlobalState?.user?.role}`,
    appraiser_id: changeId,
    ms_text: msAppraiser51(
      GlobalState?.sdp?.sdp?.find((res) => Number(res?.id) === Number(sdp))
        ?.first_name,
      GlobalState?.persons?.find((res) => Number(res?.id) === Number(customer))
        ?.first_name,
      id,
      nameEvent,
      GlobalState?.appraiser?.appraiser?.find(
        (res) => Number(res?.id) === Number(changeId)
      )?.first_name
    ),
    is_case_id: caseID,
    id: Math.floor(Math.random() * 100),
    date_time: new Date(),
  };
  axios.post(`${_URL}/insurance-case/messages/create`, getFormData(formData));
}

export default function InsuredEvents() {
  const dispatch = useDispatch();
  const person = useSelector(({ persons }) => persons);
  const events = useSelector(({ event }) => event);
  const elements = useSelector(({ cases }) => cases);
  const { insuredCompanies } = useSelector(({ insuredCmp }) => insuredCmp);
  const { city } = useSelector(({ city }) => city);
  const { region } = useSelector(({ region }) => region);
  const { agents } = useSelector(({ agents }) => agents);
  const { sdp } = useSelector(({ sdp }) => sdp);
  const { appraiser } = useSelector(({ appraiser }) => appraiser);
  const appComp = useSelector(({ appComp }) => appComp);
  const [paginationCustome, setPaginationCustome] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const GlobalState = useSelector((state) => state);

  return (
    <>
      <Header
        height={45}
        p="xs"
        sx={{
          display: "flex",
          paddingBottom: "10px !important",
          gap: 5,
        }}
      >
        <button
          className="adder"
          onClick={() => {
            if (elements.filter((item) => item?.new)?.length) {
              toast.error(
                "You cannot add new entries until you finish the previous one."
              );
            } else {
              dispatch(setCases(elements?.concat([{ new: true }])?.reverse()));
              toast.success("You can fill in a new entry");
            }
          }}
        >
          <span>Add </span>
          <PlusUser color={"#fff"} />
        </button>
        <button
          className="adder"
          onClick={() => {
            if (
              paginationCustome <
              elements?.filter(
                (_res) =>
                  !_res.delete &&
                  _res?.insured_event_id ===
                    events?.find((_eve) => _eve.id === _res?.insured_event_id)
                      ?.id
              )?.length
            ) {
              setLoading(true);
              setPaginationCustome(paginationCustome + 10);
              setTimeout(() => {
                setLoading(false);
              }, 2000);
            }
          }}
        >
          <span>+ 10</span>
        </button>
        <button
          className="adder"
          onClick={() => {
            if (
              paginationCustome <
              elements?.filter(
                (_res) =>
                  !_res.delete &&
                  _res?.insured_event_id ===
                    events?.find((_eve) => _eve.id === _res?.insured_event_id)
                      ?.id
              )?.length
            ) {
              setLoading(true);
              setPaginationCustome(
                elements?.filter(
                  (_res) =>
                    !_res.delete &&
                    _res?.insured_event_id ===
                      events?.find((_eve) => _eve.id === _res?.insured_event_id)
                        ?.id
                )?.length
              );
              setTimeout(() => {
                setLoading(false);
              }, 2000);
            }
          }}
        >
          <span>All</span>
        </button>
        <button className="adder" style={{ marginLeft: 100 }}>
          current : {paginationCustome}
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
          <input className="disabled" readOnly={true} value={"status type"} />
        </div>

        {elements
          ?.filter(
            (_res) =>
              !_res.delete &&
              _res?.insured_event_id ===
                events?.find((_eve) => _eve.id === _res?.insured_event_id)?.id
          )

          .map((item, i) => (
            <React.Fragment key={item?.id ?? i}>
              {i < paginationCustome && (
                <Rows
                  key={item?.id ?? i}
                  item={item}
                  setElements={setCases}
                  datas={elements}
                  isCompanys={insuredCompanies}
                  isCitys={city}
                  agents={agents}
                  person={person}
                  sdp={sdp}
                  appraisers={appraiser}
                  events={events}
                  appComp={appComp}
                  region={region}
                  dispatch={dispatch}
                  loading={loading}
                  GlobalState={GlobalState}
                />
              )}
            </React.Fragment>
          ))}
      </div>
    </>
  );
}
