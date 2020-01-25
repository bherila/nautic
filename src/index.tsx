import * as React from "react";
import { render } from "react-dom";
import {
  nauticAlertPlanOptions,
  nauticAlertBroadbandVideo
} from "./plan-options";
import RegistrationForm from "./registration-form";

// This maps the subscription ID in Snappy Checkout to the one with
// Broadband Video, if that option is selected

const rootElement = document.getElementById("root");
render(
  <RegistrationForm
    broadbandVideoAddOn={nauticAlertBroadbandVideo}
    renderInstallDate={false}
    renderDealerFields={false}
    renderVesselType={false}
    planOptions={nauticAlertPlanOptions}
  />,
  rootElement
);
