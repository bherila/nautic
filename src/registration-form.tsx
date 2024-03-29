import * as React from "react";
import { PlanOption } from "./plan-options";
import "./styles.css";

const getPlanOptionById: { [key: string]: PlanOption } = {};
const headingSize = "21px";
const bodySize = "17px";

interface RegistrationState {
  selectedPlan: string[];
  broadbandVideo: boolean;
  installDate: string;
  imei: string;
  ownerFname: string;
  ownerLname: string;
  ownerMi: string;
  vesselName: string;
  cellNumber: string;
  vesselType: string;
  dealerName: string;
  dealerCompany: string;
  showImeiModal: boolean;
  agreed: boolean;
  iccId: string;
}
declare var Checkout: any;

const wInput = "w-input";

const required = <span style={{ color: "red" }}>*</span>;

const linkStyle = {
  color: "blue",
  textDecoration: "underline",
  background: "transparent",
};
export default class RegistrationForm extends React.Component<
  {
    renderInstallDate: boolean;
    renderDealerFields: boolean;
    renderVesselType: boolean;
    broadbandVideoAddOn: any;
    planOptions: PlanOption[];
  },
  RegistrationState
> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedPlan: [""],
      broadbandVideo: false,
      installDate: "",
      imei: "",
      ownerFname: "",
      ownerLname: "",
      ownerMi: "",
      vesselName: "",
      cellNumber: "",
      vesselType: "",
      dealerName: "",
      dealerCompany: "",
      showImeiModal: false,
      agreed: false,
      iccId: "",
    };
  }

  saveLocalStorage() {
    const s = this.state;
    const storageData = {
      nsnIMEI: s.imei,
      nsnDate: s.installDate,
      nsnVessel: s.vesselName,
      nsnFname: s.ownerFname,
      nsnMname: s.ownerMi,
      nsnLname: s.ownerLname,
      nsnVesselType: s.vesselType,
      cellPhone: s.cellNumber,
      nsnICCID: s.iccId || "",
      nsnSubscriptionPlan:
        s.selectedPlan.join(":") +
        (s.broadbandVideo ? " + broadband video" : ""),
    };
    Object.keys(storageData).map((key) =>
      sessionStorage.setItem(key, storageData[key])
    );
  }

  generateUrlParams() {
    const keys = Object.keys(this.state);
    return keys.map((key) => key + "=" + encodeURI(this.state[key])).join("&");
  }

  textBox(title, placeholder, value, onChange) {
    const editProps = { placeholder, value, onChange };
    return (
      <div>
        <label>{title}</label>
        <input className={wInput} type="text" {...editProps} />
      </div>
    );
  }

  renderPlanOptions(
    planOptions: PlanOption[],
    depth: number,
    defaultChoice: string
  ) {
    const selectedOption = (this.state.selectedPlan || [])[depth] || "";
    console.log("selectedOption", selectedOption);
    return (
      <React.Fragment>
        <select
          className={wInput}
          onChange={(e) => {
            const selectedPlan = this.state.selectedPlan.slice(0);
            while (selectedPlan.length <= depth) selectedPlan.push("");
            selectedPlan[depth] = e.currentTarget.value;
            this.setState({ selectedPlan });
            console.log(selectedPlan);
          }}
        >
          <option>{defaultChoice || "Select One"}</option>
          {planOptions.map((opt) => {
            getPlanOptionById[opt.checkoutId || opt.name] = opt;
            return (
              <option
                value={opt.checkoutId || opt.name}
                selected={opt.name === selectedOption}
              >
                {opt.name}
                {!!opt.price && opt.price > 0 && " - $" + opt.price.toFixed(2)}
              </option>
            );
          })}
        </select>
        {/*Render sub-options*/}
        {planOptions
          .filter(
            (opt) =>
              opt.name === selectedOption && (opt.planOptions || []).length > 0
          )
          .map((opt) =>
            this.renderPlanOptions(
              opt.planOptions || [],
              depth + 1,
              opt.nextDefaultChoice || ""
            )
          )}
      </React.Fragment>
    );
  }

  renderIccid() {
    if (!this.state.broadbandVideo) {
      const sp = this.state.selectedPlan;
      const plan = getPlanOptionById[sp[sp.length - 1]];
      if (!plan || !plan.enableIccId) {
        return false;
      }
    }
    return (
      <div>
        <label>
          ICCID (19 digits) {required}
          <input
            className={wInput}
            type="tel"
            placeholder="Enter SIM ICCID"
            value={this.state.iccId}
            onChange={(e) => this.setState({ iccId: e.currentTarget.value })}
            required={true}
            minLength={19}
            maxLength={20}
          />
        </label>
      </div>
    );
  }

  renderName() {
    return (
      <div>
        <label>Vessel Owner's Full Name {required}</label>
        <input
          className={wInput}
          type="text"
          placeholder="First Name"
          autoComplete="First"
          value={this.state.ownerFname || ""}
          onChange={(e) => this.setState({ ownerFname: e.currentTarget.value })}
          required={true}
          style={{ width: "60%", display: "inline-block" }}
        />
        &nbsp;
        <input
          className={wInput}
          type="text"
          placeholder="MI (Optional)"
          value={this.state.ownerMi || ""}
          onChange={(e) => this.setState({ ownerMi: e.currentTarget.value })}
          style={{ width: "35%", display: "inline-block" }}
        />
        <input
          className={wInput}
          type="text"
          placeholder="Last Name"
          value={this.state.ownerLname || ""}
          onChange={(e) => this.setState({ ownerLname: e.currentTarget.value })}
          required={true}
        />
      </div>
    );
  }

  renderCol1() {
    const { renderInstallDate, broadbandVideoAddOn, planOptions } = this.props;
    return (
      <React.Fragment>
        <div>
          <label>Plan Options {required}</label>
          {this.renderPlanOptions(planOptions, 0, "Select Your Device")}
        </div>

        {!!broadbandVideoAddOn[this.getBasePlanId()] && (
          <React.Fragment>
            <label>
              <input
                type="checkbox"
                value="true"
                checked={this.state.broadbandVideo}
                onChange={(e) =>
                  this.setState({ broadbandVideo: e.currentTarget.checked })
                }
              />
              &nbsp; Add Broadband Video + $14.99
            </label>
          </React.Fragment>
        )}
        {renderInstallDate && (
          <div>
            <label>
              Target Install Date {required}
              <input
                className={wInput}
                type="date"
                min={new Date().toISOString() as any}
                placeholder="Target Install Date"
                value={this.state.installDate || ""}
                onChange={(e) =>
                  this.setState({ installDate: e.currentTarget.value })
                }
                required={true}
              />
            </label>
          </div>
        )}

        {this.renderImeiField()}
        {this.renderIccid()}
        <p>
          Nearshorenetworks will not share your information with others. All
          credit card information is stored by our Secure Transaction process
          provider, Stripe.
        </p>
      </React.Fragment>
    );
  }

  renderCol2() {
    const { renderDealerFields, renderVesselType } = this.props;
    return (
      <React.Fragment>
        {this.renderName()}

        <div>
          <label>Name of Vessel (if Applicable)</label>
          <input
            className={wInput}
            type="text"
            placeholder="Vessel Name"
            value={this.state.vesselName || ""}
            onChange={(e) =>
              this.setState({ vesselName: e.currentTarget.value })
            }
          />
        </div>

        <div>
          <label>Cell Phone Number {required}</label>
          <input
            className={wInput}
            type="tel"
            placeholder="(xxx) xxx-xxxx"
            value={this.state.cellNumber || ""}
            onChange={(e) =>
              this.setState({ cellNumber: e.currentTarget.value })
            }
            required={true}
          />
        </div>

        {renderVesselType && (
          <div>
            <label>Vessel Type</label>
            {["Sail", "Powered", "N/A"].map((typ) => (
              <label>
                <input
                  type="radio"
                  name="vesselType"
                  value={typ}
                  checked={typ === this.state.vesselType}
                  onChange={(e) =>
                    this.setState({ vesselType: e.currentTarget.value })
                  }
                />
                &nbsp;
                {typ}
              </label>
            ))}
          </div>
        )}
        {renderDealerFields && (
          <React.Fragment>
            <div>
              <label>Dealer or Installer Name (optional)</label>
              <input
                className={wInput}
                type="text"
                placeholder="Installer Name"
                value={this.state.dealerName || ""}
                onChange={(e) =>
                  this.setState({ dealerName: e.currentTarget.value })
                }
              />
            </div>

            <div>
              <label>Dealer or Installer Company (optional)</label>
              <input
                className={wInput}
                type="text"
                placeholder="Installer Company"
                value={this.state.dealerCompany || ""}
                onChange={(e) =>
                  this.setState({ dealerCompany: e.currentTarget.value })
                }
              />
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  renderImeiField() {
    return (
      <React.Fragment>
        <div style={{ marginTop: "25px" }}>
          <label>
            Device IMEI Number {required}
            <button
              type="button"
              onClick={(e) => this.setState({ showImeiModal: true })}
              style={linkStyle}
            >
              How do I find my IMEI?
            </button>
            <input
              className={wInput}
              type="tel"
              name="imei"
              autoComplete="off"
              placeholder="IMEI / MEID"
              value={this.state.imei || ""}
              onChange={(e) => this.setState({ imei: e.currentTarget.value })}
              required={true}
            />
          </label>
        </div>
        {this.state.imei.length > 15 &&
          !isLuhnValid(this.state.imei.split("")) && (
            <p style={{ color: "maroon" }}>
              Please double check IMEI, it is likely invalid :(
            </p>
          )}
      </React.Fragment>
    );
  }

  renderImeiModal() {
    return (
      <div
        id="modal-nautic-imei"
        className="modal"
        style={{
          display: "block",
          position: "fixed",
          boxShadow: "-3px 2px 3px 7px #ccc",
          top: "20%",
          left: "30%",
          right: "30%",
          zIndex: 1000,
          background: "#fff",
          padding: "4rem",
          fontSize: bodySize,
        }}
      >
        <button
          style={{ float: "right", fontWeight: "bold", fontSize: headingSize }}
          onClick={(e) => this.setState({ showImeiModal: false })}
        >
          X
        </button>
        <h3 style={{ marginTop: 0 }}>How do I find my IMEI?</h3>
        <ol>
          <li>
            Go to Home Screen, press button in upper right to be taken to System
            Settings
          </li>
          <li>
            At System Settings scroll the bottom bar to the left and press
            “Info” tab. &nbsp;The “MEID” line is the IMEI.
          </li>
        </ol>
        <img
          src="https://assets.website-files.com/5a29d8f7c76e0b0001d9eac5/5b463af08b30b647f3f575f0_Insight%20MEID%20Screenshot.JPG"
          srcSet="https://assets.website-files.com/5a29d8f7c76e0b0001d9eac5/5b463af08b30b647f3f575f0_Insight%20MEID%20Screenshot-p-800.jpeg 800w, https://assets.website-files.com/5a29d8f7c76e0b0001d9eac5/5b463af08b30b647f3f575f0_Insight%20MEID%20Screenshot.JPG 982w"
          sizes="(max-width: 479px) 79vw, (max-width: 767px) 84vw, (max-width: 991px) 323px, 429px"
          alt=""
          style={{
            paddingTop: "10px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
    );
  }

  render() {
    const isValid = this.isPlanValid() && this.state.agreed;
    return (
      <form style={{ fontSize: bodySize }} onSubmit={(e) => this.submitForm(e)}>
        {this.state.showImeiModal && this.renderImeiModal()}
        <div className="quote-form-wrapper new-form">
          <div className="w-row">
            <div className="w-col w-col-6">{this.renderCol1()}</div>
            <div className="w-col w-col-6">{this.renderCol2()}</div>
          </div>
          <div className="w-row">{this.renderTerms()}</div>
          <div className="w-row">
            <div className="w-col w-col-12" style={{ textAlign: "center" }}>
              <button
                type="submit"
                disabled={!isValid}
                className={
                  "buy-button button-icon w-button " + (!isValid && "disabled")
                }
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  renderTerms() {
    return (
      <div style={{ textAlign: "left" }}>
        <h3 style={{ fontSize: headingSize }}>Terms of Service</h3>
        <h3 style={{ fontSize: bodySize, margin: 0 }}>Satellite</h3>
        <ul style={{ fontSize: bodySize }}>
          <li style={{ fontSize: bodySize }}>Usage above Plan selected is billed at $1.89 per kb.</li>
          <li style={{ fontSize: bodySize }}>
            Charges will be applied and billed the month following that in which
            charges are incurred.
          </li>
        </ul>
        <h3 style={{ fontSize: bodySize, margin: 0 }}>
          Cellular and Broadband Video
        </h3>
        <ul style={{ columnCount: 1, fontSize: bodySize }}>
          {[
            "Cellular Service requires 24 hours to activate, Monday-Friday.  Activation requests received on Friday activate on Monday.",
            "Activation Fee is $24.95.  First charge will be the Activation Fee plus the first month on a 3 month minimum subscription.",
            "A 3-month minimum applies to any Service Plan subscription, upgrade or downgrade.",
            "Usage above Plan Subscription limits during a month from bill date to bill date will be charged at $ 9.00 per GB in 1 GB increments.",
            "Unused data does not carry over month to month.",
            "Plan usage charges will be applied and billed the month following the month in which usage charges are incurred.",
            "Termination requires 30 day notification and Subscriber is responsible for all charges through this period.",
            "Complete deactivation of Service will require reactivation and a new Activation Fee will be charged.",
            "All plans are unthrottled and all usage is the responsibility of the Subscriber of Record.",
            "Subscribers are responsible for security surrounding access to their Device and all usage.",
            "High Usage Alert notification is not provided.  Staying within Plan Subscription limits are the sole responsibility of the Subscriber.",
            "Subscription to any plan acknowledges the above and agreement to these Terms and Conditions.",
            coverageMapTerm,
            "Broadband video includes 2 GB of data. Unused data does not carry over.",
            "Additional cellular usage above plan is billed in GB increments at $9 per GB.",
            "Travel outside the US and Canada can result in additional cellular usage charges and are authorized by subscribing to this service.",
            "Connection is NOT guaranteed at any time and conditions based on proximity to cellular towers as well as weather conditions affect quality of service.",
            "Travel outside the US and Canada can result in additional charges and are authorized by subscribing to this service.",
            "No connectivity outside the US is guaranteed or warranted.",
          ].map((i) => (
            <li style={{ fontSize: bodySize }}>{i}</li>
          ))}
        </ul>
        <label style={{ fontSize: bodySize }}>
          <input
            type="checkbox"
            checked={this.state.agreed || false}
            onClick={(e) => this.setState({ agreed: e.currentTarget.checked })}
          />
          &nbsp;I agree to the Terms of Service
        </label>
      </div>
    );
  }

  getBasePlanId() {
    return this.state.selectedPlan.slice(-1)[0] || "";
  }

  getSelectedPlanId() {
    const { broadbandVideoAddOn } = this.props;
    const basePlan = this.getBasePlanId();
    if (this.state.broadbandVideo) {
      const bbv = broadbandVideoAddOn[basePlan];
      return bbv || basePlan;
    }
    return basePlan;
  }

  isPlanValid() {
    const { broadbandVideoAddOn } = this.props;
    return !!broadbandVideoAddOn[this.getBasePlanId()];
  }

  submitForm(e) {
    e.preventDefault();
    this.saveLocalStorage();
    Checkout.loadButton(this.getSelectedPlanId(), this.generateUrlParams());
  }
}

const isLuhnValid = (function luhn(array) {
  return function (number) {
    let len = number ? number.length : 0,
      bit = 1,
      sum = 0;

    while (len--) {
      sum += !(bit ^= 1) ? parseInt(number[len], 10) : array[number[len]];
    }

    return sum % 10 === 0 && sum > 0;
  };
})([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]);

const tMobileCoverageMap = () => (
  <b>
    <a
      href="https://www.t-mobile.com/coverage/coverage-map"
      target="_blank"
      rel="noopener noreferrer"
    >
      T-Mobile Coverage Map
    </a>
    .&nbsp;
  </b>
);

const coverageMapTerm = (
  <React.Fragment>
    Coverage maps are an indicator and not a guarantee of coverage or network
    access.
  </React.Fragment>
);
