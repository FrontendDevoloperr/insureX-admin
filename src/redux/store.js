import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./reducer";
import insuredCmp from "./reducer/insuredCompanies";
import city from "./reducer/city";
import region from "./reducer/region";
import agents from "./reducer/agents";
import Person from "./reducer/insuredPerson";

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    insuredCmp,
    city,
    region,
    agents,
    Person,
  },
});
