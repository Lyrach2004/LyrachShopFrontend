export default {
    auth: {
        domain: "YOUR_AUTH0_DOMAIN",
        clientId: "YOUR_AUTH0_CLIENT_ID",
        redirectUri: window.location.origin,
        audience: "YOUR_BACKEND_API_URL",
        scope: "openid profile email"
    },
    httpInterceptor: {
        allowedList: [
            'YOUR_BACKEND_API_URL/api/orders/**',
            'YOUR_BACKEND_API_URL/api/checkout/purchase'
        ],
    },
}
