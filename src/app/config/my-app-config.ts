export default {
  auth: {
    domain: "dev-i84vrom2owtc40nd.us.auth0.com",
    clientId: "48stfNgMrDUSViIFoMJgug8UGlcTea1E",
    redirect_uri: "https://localhost:4200",
    audience: "http://localhost:8080",
    scope: "openid profile email",
    redirectUri: window.location.origin
  },
  httpInterceptor: {
    allowedList: [
      'http://localhost:8080/api/orders/**',
      'http://localhost:8080/api/checkout/purchase'
    ],
  },
}

