import * as React from "react";
import { render } from "react-dom";

import "./styles.css";

declare var Checkout: any;

const isLuhnValid = (function luhn(array: any) {
  return function(number: any) {
    let len = number ? number.length : 0,
      bit = 1,
      sum = 0;

    while (len--) {
      sum += !(bit ^= 1) ? parseInt(number[len], 10) : array[number[len]];
    }

    return sum % 10 === 0 && sum > 0;
  };
})([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]);

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
}

const wInput = "w-input";

const linkStyle = {
  color: "blue",
  textDecoration: "underline",
  background: "transparent"
};

interface PlanOption {
  name: string;
  planOptions?: PlanOption[];
  nextDefaultChoice?: string;
  price?: number;
  checkoutId?: string;
}

// This maps the subscription ID in Snappy Checkout to the one with
// Broadband Video, if that option is selected
const broadbandVideoAddOn = {
  UX3PAAODXHR8XWPSSOZWP14533: "TSESO16SDJK3XBU8PSSNP20548",
  "5C73RJC6X0BN61N2EXARP14532": "S1V7JWWSB6ZBSUWXXWR0P20549",
  HWWUH0KQXJUNQN1ACU57P14534: "Y4Q7Y4QBDYOHGVY5X4W3P20552",
  KK0HFNXPQLPQHDDUZDYPP14535: "3EPAD13DMVJ2RJEF0SUWP20551",
  QO4NVC6WY2G48VME7TDLP17805: "UX3Q99GLJVPYPKR1XJX0P20553",
  HDEW8K3SLND25KAUC6VTP17806: "2QJDBGDG9XUFMS0TYE4FP20554",
  PQNXPQMUDCM1DSQBF7PWP17807: "UWZ5UQ3CHFQABQN1979RP20555"
};

const planOptions: PlanOption[] = [
  {
    name: "Insight Cellular",
    nextDefaultChoice: "Choose Your 4G LTE Service",
    planOptions: [
      {
        name: "Reporting Service 4G LTE Standard",
        price: 14.99,
        checkoutId: "5C73RJC6X0BN61N2EXARP14532"
      },
      {
        name: "Reporting Service 4G LTE Enhanced",
        price: 19.99,
        checkoutId: "UX3PAAODXHR8XWPSSOZWP14533"
      }
    ]
  },
  {
    name: "Insight Satellite",
    nextDefaultChoice: "Choose Your Satellite Service",
    planOptions: [
      {
        name: "Reporting Service Satellite Standard",
        price: 34.99,
        checkoutId: "HWWUH0KQXJUNQN1ACU57P14534"
      },
      {
        name: "Reporting Service Satellite Enhanced",
        price: 44.99,
        checkoutId: "KK0HFNXPQLPQHDDUZDYPP14535"
      },
      {
        name: "Vessel Monitoring Service via Satellite 24",
        price: 39.99,
        checkoutId: "QO4NVC6WY2G48VME7TDLP17805"
      },
      {
        name: "Vessel Monitoring Service via Satellite 48",
        price: 59.99,
        checkoutId: "HDEW8K3SLND25KAUC6VTP17806"
      },
      {
        name: "Vessel Monitoring Service via Satellite 96",
        price: 109.99,
        checkoutId: "PQNXPQMUDCM1DSQBF7PWP17807"
      },
      { name: "CloudWatch", price: 69.99 }
    ]
  },
  {
    name: "VTracker",
    nextDefaultChoice: "Choose Your Service",
    planOptions: [
      { name: "Standard", price: 29.99 },
      { name: "CloudWatch", price: 69.99 }
    ]
  }
];
class NauticAlert extends React.Component<{}, RegistrationState> {
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
      showImeiModal: false
    };
  }

  generateUrlParams() {
    const keys = Object.keys(this.state);
    return keys.map(key => key + "=" + encodeURI(this.state[key])).join("&");
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
    defaultChoice: string | undefined
  ) {
    const selectedOption = (this.state.selectedPlan || [])[depth] || "";
    console.log("selectedOption", selectedOption);
    return (
      <React.Fragment>
        <select
          className={wInput}
          onChange={e => {
            const selectedPlan = this.state.selectedPlan.slice(0);
            while (selectedPlan.length <= depth) selectedPlan.push("");
            selectedPlan[depth] = e.currentTarget.value;
            this.setState({ selectedPlan });
            console.log(selectedPlan);
          }}
        >
          <option>{defaultChoice || "Select One"}</option>
          {planOptions.map(opt => (
            <option
              value={opt.checkoutId || opt.name}
              selected={opt.name === selectedOption}
            >
              {opt.name}
              {!!opt.price && opt.price > 0 && " - $" + opt.price.toFixed(2)}
            </option>
          ))}
        </select>
        {/*Render sub-options*/}
        {planOptions
          .filter(
            opt =>
              opt.name === selectedOption && (opt.planOptions || []).length > 0
          )
          .map(opt =>
            opt.planOptions && this.renderPlanOptions(
              opt.planOptions,
              depth + 1,
              opt.nextDefaultChoice
            )
          )}
      </React.Fragment>
    );
  }

  renderName() {
    return (
      <div>
        <label>Vessel Owner's Full Name</label>
        <input
          className={wInput}
          type="text"
          placeholder="First Name"
          autoComplete="First"
          value={this.state.ownerFname || ""}
          onChange={e => this.setState({ ownerFname: e.currentTarget.value })}
          required={true}
          style={{ width: "60%", display: "inline-block" }}
        />
        &nbsp;
        <input
          className={wInput}
          type="text"
          placeholder="MI (Optional)"
          value={this.state.ownerMi || ""}
          onChange={e => this.setState({ ownerMi: e.currentTarget.value })}
          style={{ width: "35%", display: "inline-block" }}
        />
        <input
          className={wInput}
          type="text"
          placeholder="Last Name"
          value={this.state.ownerLname || ""}
          onChange={e => this.setState({ ownerLname: e.currentTarget.value })}
          required={true}
        />
      </div>
    );
  }

  renderCol1() {
    return (
      <React.Fragment>
        <div>
          <label>Plan Options</label>
          {this.renderPlanOptions(planOptions, 0, "Select Your Device")}
        </div>

        {!!broadbandVideoAddOn[this.getBasePlanId()] && (
          <label>
            <input
              type="checkbox"
              value="true"
              checked={this.state.broadbandVideo}
              onChange={e =>
                this.setState({ broadbandVideo: e.currentTarget.checked })
              }
            />
            &nbsp; Include Broadband Video + $9.99
          </label>
        )}
        <br />

        <div>
          <label>
            Target Install Date
            <input
              className={wInput}
              type="date"
              min={new Date().toISOString() as any}
              placeholder="Target Install Date"
              value={this.state.installDate || ""}
              onChange={e =>
                this.setState({ installDate: e.currentTarget.value })
              }
              required={true}
            />
          </label>
        </div>

        <div>
          <label>
            Device IMEI Number{" "}
            <button
              type="button"
              onClick={e => this.setState({ showImeiModal: true })}
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
              onChange={e => this.setState({ imei: e.currentTarget.value })}
              required={true}
            />
          </label>
        </div>
        {this.state.ownerFname.length > 1 &&
          !isLuhnValid(this.state.imei.split("")) && (
            <p style={{ color: "maroon" }}>
              Please double check IMEI, it is likely invalid :(
            </p>
          )}
        <p className="text-block-19">
          Nearshorenetworks will not share your information with others. All
          credit card information is stored by our Secure Transaction process
          provider, Stripe.
        </p>
        <p className="text-block-19">
          Usage above Plan selected is billed at $ 1.89 per kb. These charges
          will be applied and billed the month following that in which charges
          are incurred.
        </p>
      </React.Fragment>
    );
  }

  renderCol2() {
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
            onChange={e => this.setState({ vesselName: e.currentTarget.value })}
          />
        </div>

        <div>
          <label>Cell Phone Number</label>
          <input
            className={wInput}
            type="tel"
            placeholder="(xxx) xxx-xxxx"
            value={this.state.cellNumber || ""}
            onChange={e => this.setState({ cellNumber: e.currentTarget.value })}
            required={true}
          />
        </div>

        <div>
          <label>Vessel Type</label>
          {["Sail", "Powered", "N/A"].map(typ => (
            <label>
              <input
                type="radio"
                name="vesselType"
                value={typ}
                checked={typ === this.state.vesselType}
                onChange={e =>
                  this.setState({ vesselType: e.currentTarget.value })
                }
              />
              &nbsp;
              {typ}
            </label>
          ))}
        </div>

        <div>
          <label>Dealer or Installer Name (optional)</label>
          <input
            className={wInput}
            type="text"
            placeholder="Installer Name"
            value={this.state.dealerName || ""}
            onChange={e => this.setState({ dealerName: e.currentTarget.value })}
          />
        </div>

        <div>
          <label>Dealer or Installer Company (optional)</label>
          <input
            className={wInput}
            type="text"
            placeholder="Installer Company"
            value={this.state.dealerCompany || ""}
            onChange={e =>
              this.setState({ dealerCompany: e.currentTarget.value })
            }
          />
        </div>
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
          padding: "4rem"
        }}
      >
        <button
          style={{ float: "right", fontWeight: "bold", fontSize: "20px" }}
          onClick={e => this.setState({ showImeiModal: false })}
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
            marginRight: "auto"
          }}
        />
      </div>
    );
  }

  render() {
    const isValid = this.isPlanValid();
    return (
      <form onSubmit={e => this.submitForm(e)}>
        {this.state.showImeiModal && this.renderImeiModal()}
        <div className="quote-form-wrapper new-form w-col-6">
          <div className="w-row">
            <div className="w-col w-col-6">{this.renderCol1()}</div>
            <div className="w-col w-col-6">{this.renderCol2()}</div>
          </div>
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

  getBasePlanId() {
    return this.state.selectedPlan.slice(-1)[0] || "";
  }

  getSelectedPlanId() {
    const basePlan = this.getBasePlanId();
    if (this.state.broadbandVideo) {
      const bbv = broadbandVideoAddOn[basePlan];
      return bbv || basePlan;
    }
    return basePlan;
  }

  isPlanValid() {
    return !!broadbandVideoAddOn[this.getBasePlanId()];
  }

  submitForm(e) {
    e.preventDefault();
    Checkout.loadButton(this.getSelectedPlanId(), this.generateUrlParams());
  }
}

const rootElement = document.getElementById("root");
render(<NauticAlert />, rootElement);
