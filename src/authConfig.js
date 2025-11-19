export const msalConfig = {
    auth: {
        clientId: "fac4f475-e7a6-4a9d-a091-dd2ffc0eb1b4",
        authority: "https://login.microsoftonline.com/80630113-3505-4ce6-8fcb-7f3eca166360",
        redirectUri: typeof window !== 'undefined' ? window.location.origin : "https://hello.stepbyday.com/",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: ["User.Read"]
};