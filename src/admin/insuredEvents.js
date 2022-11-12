import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { LoadingOverlay, Header, ActionIcon, Select } from "@mantine/core";
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
import SearchComponent from "../ui/search";
import { getEventsAndCasesFC } from "../utils/request";

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
  user,
}) {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [statustId, setStatustId] = React.useState(item?.status_id ?? 1);
  const [cityValue, setCityValue] = React.useState(item?.city_id);

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
  const [regionId, setRegionId] = React.useState(
    region.find(
      (options) =>
        options.id ===
        events.find((options) => options.id === item?.insured_event_id)
          ?.region_id
    )?.id
  );
  const [typeCaseIds, setTypeCaseIds] = React.useState(
    JSON.stringify({
      event_type_id: item?.event_type_id,
      property_type_id: item?.property_type_id,
    })
  );
  if (item?.id) {
    if (
      !events?.find((eve) => eve?.id === item?.insured_event_id) ||
      !person.find((_person) => _person?.id === item?.insured_person_id)?.id
    )
      return null;
  }

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    let formData = {
      insured_person_id: personId ?? item.insured_person_id,
      address: data.address,
      insured_number: data.insured_number,
      city_id: cityValue,
      agent_id: agent ?? item.agent_id,
      appraiser_id: appraiser ?? item.appraiser_id,
      sdp_id: sdpId ?? item.sdp_id,
      event_type_id:
        JSON.parse(typeCaseIds ?? "{}")?.event_type_id ??
        item.event_type_id ??
        1,
      property_type_id:
        JSON.parse(typeCaseIds ?? "{}")?.property_type_id ??
        item.property_type_id ??
        1,
      document_date: item?.document_date,
      status_id: statustId ?? item.status_id,
    };

    let eventFormData = {
      insurance_company_id: insComp ?? item.insurance_company_id,
      insured_person_id: personId ?? item.insured_person_id,
      region_id: regionId ?? item.region_id,
      address: item.address,
      date: data?.date ?? item?.document_date,
      agent_id: agent ?? item.agent_id,
      appraisal_company_id: appCom ?? data?.appraisal_company_id,
      appraiser_id: appraiser ?? item.appraiser_id ?? appraisers[0]?.id,
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
          axios
            .patch(
              `${_URL}/insured-events/${item?.insured_event_id}`,
              getFormData(eventFormData)
            )
            .then((res) => {
              SendAppraiserMessage(
                item?.appraiser_id,
                appraiser ?? data.appraiser_id,
                personId,
                sdpId ?? data.sdp_id,
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
              getEventsAndCasesFC(dispatch, user, "/events");
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
        .post(`${_URL}/insurance-case`, getFormData(formData))
        .then((res) => {
          getEventsAndCasesFC(dispatch, user, "/events");
          setIsUpdated(false);
          setIsLoading(false);
          toast.success("Data uploaded, new event created");
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
          <input
            className="disabled"
            readOnly={true}
            value={item?.id ?? "new"}
            style={{ width: 50 }}
          />
          <select
            required
            onInput={(e) => {
              setIsUpdated(true);
              setAppCom(e.target.value);
            }}
            value={appCom}
            {...register(`appraisal_company_id`)}
          >
            {appComp?.map((options) => (
              <option
                disabled={
                  user?.role === "appraisal_company" &&
                  options?.id !== user?.appraisal_company?.id
                }
                key={options?.id}
                value={options?.id}
              >
                {options?.appraisal_company_name}
              </option>
            ))}
          </select>

          <select
            onInput={(e) => {
              setIsUpdated(true);
              setAppraiser(e.target.value);
            }}
            required
            value={
              appraiser ??
              appraisers?.find((_app) => _app?.id === item?.appraiser_id)?.id
            }
            {...register(`appraiser_id`)}
          >
            <option>Choose...</option>
            {appraisers?.map((options) => (
              <option key={options?.id} value={options?.id}>
                {options?.first_name}
              </option>
            ))}
          </select>

          <select
            required
            onInput={(e) => {
              setIsUpdated(true);
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
            required
            onInput={(e) => {
              setIsUpdated(true);
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
            required
            style={!item?.new && !isUpdated ? {} : { display: "none" }}
            readOnly={true}
            onFocus={() => {
              if (
                item?.insured_person_id &&
                user.role !== "appraisal_company"
              ) {
                navigate("/persons#" + item?.insured_person_id);
              }
            }}
            value={
              person.find((_person) => _person?.id === personId)?.first_name
            }
            {...register(`insured_person_id`)}
          />

          <select
            required
            style={!item?.new && !isUpdated ? { display: "none" } : {}}
            onInput={(e) => {
              setIsUpdated(true);
              setPersonId(e.target.value);
            }}
            value={personId}
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
              setiInsComp(e.target.value);
            }}
            value={
              insComp ??
              events?.find((eve) => eve?.id === item?.insured_event_id)
                ?.insurance_company_id
            }
            {...register(`insurance_company_id`)}
            required
          >
            {isCompanys?.map((options) => (
              <option
                disabled={
                  user?.role === "insurance_company" &&
                  options?.id !== user?.insurance_company?.id
                }
                key={options.id}
                value={options.id}
              >
                {options.title}
              </option>
            ))}
          </select>
          <input
            onInput={(e) => {
              setIsUpdated(true);
            }}
            value={item?.insured_number}
            {...register(`insured_number`)}
            required
          />
          <input
            style={{
              width: "140px",
            }}
            onFocus={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.target.type = "date";
            }}
            onInput={(e) => {
              setIsUpdated(true);
            }}
            onMouseMove={(e) => {
              e.target.type = "date";
            }}
            onMouseLeave={(e) => {
              e.target.type = "text";
            }}
            defaultValue={item?.document_date}
            {...register(`document_date`)}
            required
          />
          <input
            onInput={(e) => {
              setIsUpdated(true);
            }}
            defaultValue={item?.address}
            {...register(`address`)}
            required
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

          <select
            required
            onInput={(e) => {
              setIsUpdated(true);
              setRegionId(e.target.value);
            }}
            value={
              regionId ??
              region.find(
                (options) =>
                  options.id ===
                  events.find(
                    (options) => options.id === item?.insured_event_id
                  )?.region_id
              )?.id
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
            required
            onInput={(e) => {
              setIsUpdated(true);
              setTypeCaseIds(e.target.value);
            }}
            value={
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
            required
            onInput={(e) => {
              setStatustId(e.target.value);
              setIsUpdated(true);
            }}
            value={statustId}
          >
            {StatusesData(
              CaseTypeExtract(JSON.parse(typeCaseIds ?? "{}"))?.link
            )?.map((options) => (
              <option key={options?.id} value={options?.id}>
                {options?.title}
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
            <button type="submit">{item?.id ? "Update" : "Create"}</button>
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

const msAppraiser51 = (
  nameSdp,
  nameCustomer,
  numberEvent,
  nameEvent,
  nameAppraiser
) =>
  `שלום ${nameAppraiser}, נפתח אירוע ${nameEvent} מס' ${numberEvent} ע"י ${nameCustomer}, קבע שיחת וידאו עם  ${
    nameSdp ?? ""
  } `;

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

  let formData = {
    type: `admin-${GlobalState?.user?.role}`,
    appraiser_id: changeId,
    ms_text: msAppraiser51(
      GlobalState?.sdp?.sdp?.find((res) => Number(res?.id) === Number(sdp))
        ?.first_name,
      GlobalState?.persons?.find((res) => Number(res?.id) === Number(customer))
        ?.first_name,
      caseID,
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
  const cases = useSelector(({ cases }) => cases);
  const { insuredCompanies } = useSelector(({ insuredCmp }) => insuredCmp);
  const { city } = useSelector(({ city }) => city);
  const { region } = useSelector(({ region }) => region);
  const { agents } = useSelector(({ agents }) => agents);
  const { sdp } = useSelector(({ sdp }) => sdp);
  const user = useSelector(({ user }) => user);
  const { appraiser } = useSelector(({ appraiser }) => appraiser);
  const appComp = useSelector(({ appComp }) => appComp);
  const [paginationCustome, setPaginationCustome] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const GlobalState = useSelector((state) => state);
  const [filteredData, setFilteredData] = React.useState([]);
  const [elements, setElements] = React.useState(cases ?? []);
  const [inputText, setInputText] = React.useState("");

  React.useEffect(() => {
    setElements(cases);
  }, [cases]);

  const Form = useCallback(() => {
    return [...(inputText?.length ? filteredData : elements)]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .map((item, i) => (
        <React.Fragment key={item?.id ?? i}>
          {i < paginationCustome && (
            <Rows
              key={item?.id ?? "craete"}
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
              user={user}
            />
          )}
        </React.Fragment>
      ));
  }, [
    city,
    person,
    sdp,
    inputText,
    GlobalState,
    user,
    loading,
    region,
    dispatch,
    appComp,
    events,
    paginationCustome,
    insuredCompanies,
    agents,
    appraiser,
    elements,
    filteredData,
  ]);

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "50px",
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
                dispatch(
                  setCases(elements?.concat([{ new: true }])?.reverse())
                );
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
                    Number(_res?.insured_event_id) ===
                      Number(
                        events?.find(
                          (_eve) =>
                            Number(_eve.id) === Number(_res?.insured_event_id)
                        )?.id
                      )
                )?.length
              ) {
                setLoading(true);
                setPaginationCustome(paginationCustome + 10);
                setTimeout(() => {
                  setLoading(false);
                }, 1000);
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
                        events?.find(
                          (_eve) => _eve.id === _res?.insured_event_id
                        )?.id
                  )?.length
                );
                setTimeout(() => {
                  setLoading(false);
                }, 1000);
              }
            }}
          >
            <span>All</span>
          </button>
          <button className="adder">current : {paginationCustome}</button>
          <SearchComponent
            data={elements?.filter(
              (_res) =>
                !_res.delete &&
                _res?.insured_event_id ===
                  events?.find((_eve) => _eve.id === _res?.insured_event_id)?.id
            )}
            setFilteredData={setFilteredData}
            setInputText={setInputText}
            type={["id", "address"]}
          />
        </div>
      </Header>
      <div
        className="ox-scroll"
        style={{ minHeight: "max-content", overflow: "hidden" }}
      >
        {" "}
        <div className="row">
          <input
            className="disabled"
            readOnly={true}
            value={"№ ID"}
            style={{ width: 50 }}
          />
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
          <input
            className="disabled"
            style={{ width: 32, padding: 0 }}
            readOnly={true}
            value={"Store"}
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
        <LoadingOverlay visible={loading} />
        <Form />
      </div>
    </>
  );
}
