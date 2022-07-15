import axios from "axios";
import { useState } from "react";

export const _URL = "http://3.91.9.208:3002/api";

export const GetRegionName = async (regionId) => {
  if (regionId === false) return false;
  return ".";
};

export const InsuredPerson = (insuredPersonId) => {
  return axios.get(`${_URL}/insured_person/${insuredPersonId}`).then((res) => {
    return res?.data?.message?.insured_person;
  });
};

export const getFormData = (object) => {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
};

export const CaseTypeExtract = (data) => {
  return typeCase?.find(
    (item) =>
      item.event_type_id === data?.event_type_id &&
      item.property_type_id === data?.property_type_id
  );
};

export const typeCase = [
  {
    event_type_id: 1,
    property_type_id: 1,
    link: "accident",
    name: "תאונת דרכים",
    icon: "accident",
  },
  {
    event_type_id: 3,
    property_type_id: 1,
    link: "carburglary",
    name: "פריצה",
    icon: "carburglary",
  },
  {
    event_type_id: 5,
    property_type_id: 1,
    link: "theftcar",
    name: "גניבה",
    icon: "theftcar",
  },
  {
    event_type_id: 9,
    property_type_id: 2,
    link: "nature-damage-home",
    name: "נזקי טבע",
    icon: "nature",
  },
  {
    event_type_id: 9,
    property_type_id: 3,
    link: "nature-damage-office",
    name: "נזקי טבע",
    icon: "nature",
  },
  {
    event_type_id: 2,
    property_type_id: 2,
    link: "water-damage-home",
    name: "מים",
    icon: "water",
  },
  {
    event_type_id: 2,
    property_type_id: 3,
    link: "water-damage-office",
    name: "מים",
    icon: "water",
  },
  {
    event_type_id: 4,
    property_type_id: 2,
    link: "fire-damage-home",
    name: "אש",
    icon: "fire",
  },
  {
    event_type_id: 4,
    property_type_id: 3,
    link: "fire-damage-office",
    name: "אש",
    icon: "fire",
  },
  {
    event_type_id: 6,
    property_type_id: 2,
    link: "burglary-home",
    name: "פריצה / גניבה",
    icon: "burglary",
  },
  {
    event_type_id: 6,
    property_type_id: 3,
    link: "burglary-office",
    name: "פריצה / גניבה",
    icon: "burglary",
  },
  {
    event_type_id: 7,
    property_type_id: 2,
    link: "person-3d-home",
    name: "צד שלישי",
    icon: "person-3d",
  },
  {
    event_type_id: 7,
    property_type_id: 3,
    link: "person-3d-office",
    name: "צד שלישי",
    icon: "person-3d",
  },
  {
    event_type_id: 8,
    property_type_id: 2,
    link: "others-home",
    name: "אחר",
    icon: "other",
  },
  {
    event_type_id: 8,
    property_type_id: 3,
    link: "others-office",
    name: "אחר",
    icon: "other",
  },
];
