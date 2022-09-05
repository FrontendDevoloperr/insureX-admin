import axios from "axios";

export const _URL = "https://api.insurextest.link/api";

export const GetRegionName = async (regionId) => {
  if (regionId === false) return false;
  return ".";
};

export const InsuranceCompanyName = (insuranceCompanyId) => {
  axios.get(`${_URL}/insurance-companies/${insuranceCompanyId}`).then((res) => {
    console.log(res?.data?.message?.insurance_company?.title);
    return res?.data?.message?.insurance_company?.title;
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

export const getRequest = async (url) => {
  return await axios.get(`${URL}` + url, {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
      } `,
    },
  });
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

export const StatusesData = [
  {
    id: 1,
    description: "פתיחת אירוע תאונת דרכים",
    ru_description: "Открытие страхового случая",
    inbox_notification: false,
  },
  {
    id: 2,
    description: "ממתינים למספר תביעה השלמת את מילוי טופס התביעה,",
    ru_description: "Заполнена претензия",
    inbox_notification: true,
  },
  {
    id: 3,
    description: "התקבל מספר תביעה",
    ru_description: "Случай зарегистрирован",
    inbox_notification: true,
  },
  {
    id: 4,
    description: "הרכב נקלט במוסך",
    ru_description: "Авто забрали в гараж",
    inbox_notification: true,
  },
  {
    id: 5,
    description: "בוצעה בדיקת שמאי",
    ru_description: "Проведена оценка",
    inbox_notification: true,
  },
  {
    id: 6,
    description: 'דו"ח שמאי נשלח לחברת הביטוח',
    ru_description: "Отчет об оценке отправлен в страховую компанию",
    inbox_notification: true,
  },
  {
    id: 7,
    description: "ממתינים לאישור חברת הביטוח",
    ru_description: "В ожидании одобрения страховой компании",
    inbox_notification: true,
  },
  {
    id: 8,
    description: "הרכב בתיקון במוסך",
    ru_description: "Авто на ремонте в гараже",
    inbox_notification: true,
  },
  {
    id: 9,
    description: "תיקון הרכב הושלם",
    ru_description: "Ремонт завершен",
    inbox_notification: true,
  },
];

export const supplier_types = [
  {
    id: 1,
    name: "שרברב",
    description: "Pipe burst, flooding",
    ru_description: "Прорыв труб, затопление",
  },
  {
    id: 3,
    name: "קבלן שיקום",
    description: "Rehabilitation Contractor",
    ru_description: "Подрядчик по реабилитации",
  },
  {
    id: 4,
    name: "גרר",
    description: "Tow truck",
    ru_description: "Эвакуатор",
  },
  {
    id: 5,
    name: "מוסך",
    description: "Service station",
    ru_description: "СТО",
  },
  {
    id: 6,
    name: "בודק תכולת רטיבות",
    description: "Damage check",
    ru_description: "Проверка ущерба",
  },
  {
    id: 7,
    name: "חוקר שרפות",
    description: "Fire inspector",
    ru_description: "Пожарный испектор",
  },
  {
    id: 8,
    name: "מהנדס כללי",
    description: "Engineer",
    ru_description: "Инженер",
  },
  {
    id: 2,
    name: "מאתר נזילות",
    description: "Damage locator",
    ru_description: "Локатор повреждений",
  },
];
