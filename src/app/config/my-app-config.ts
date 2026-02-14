export default {
  auth: {
    domain: "dev-i84vrom2owtc40nd.us.auth0.com",
    clientId: "48stfNgMrDUSViIFoMJgug8UGlcTea1E",
    authorizationParams: {
      redirect_uri: "http://localhost:4200",
      audience: "http://localhost:8080",
    },
  },
  httpInterceptor: {
    allowedList: [
      'http://localhost:8080/api/orders/**',
      'http://localhost:8080/api/checkout/purchase'
    ],
  },
}

