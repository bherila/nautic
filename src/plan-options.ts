export interface PlanOption {
  name: string;
  planOptions?: PlanOption[];
  nextDefaultChoice?: string;
  price?: number;
  checkoutId?: string;
}

export const nauticAlertBroadbandVideo = {
  UX3PAAODXHR8XWPSSOZWP14533: "TSESO16SDJK3XBU8PSSNP20548",
  "5C73RJC6X0BN61N2EXARP14532": "S1V7JWWSB6ZBSUWXXWR0P20549",
  HWWUH0KQXJUNQN1ACU57P14534: "Y4Q7Y4QBDYOHGVY5X4W3P20552",
  KK0HFNXPQLPQHDDUZDYPP14535: "3EPAD13DMVJ2RJEF0SUWP20551",
  QO4NVC6WY2G48VME7TDLP17805: "UX3Q99GLJVPYPKR1XJX0P20553",
  HDEW8K3SLND25KAUC6VTP17806: "2QJDBGDG9XUFMS0TYE4FP20554",
  PQNXPQMUDCM1DSQBF7PWP17807: "UWZ5UQ3CHFQABQN1979RP20555"
};

export const nauticAlertPlanOptions: PlanOption[] = [
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
      { name: "Enhanced", price: 49.99 },
      { name: "CloudWatch", price: 69.99 }
    ]
  },
  {
    name: "Broadband Video Only",
    price: 14.99,
    checkoutId: "PLR0V9PRNYVHVUNNCSX7P20621"
  }
];
