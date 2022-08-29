import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./reducer";
import insuredCmp from "./reducer/insuredCompanies";
import city from "./reducer/city";
import region from "./reducer/region";
import agents from "./reducer/agents";
import persons from "./reducer/insuredPerson";
import sdp from "./reducer/sdp";
import appraiser from "./reducer/appraiser";
import appComp from "./reducer/appraiserComp";
import cases from "./reducer/cases";
import event from "./reducer/events";

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    insuredCmp,
    city,
    region,
    agents,
    persons,
    sdp,
    appraiser,
    appComp,
    cases,
    event,
  },
});
