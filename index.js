const AUTH0_DOMAIN = window.__ENV.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = window.__ENV.AUTH0_CLIENT_ID;
console.log(AUTH0_DOMAIN);
console.log(AUTH0_CLIENT_ID);

document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize Auth0 with environment variables
    const auth0 = new Auth0Client({
        domain: AUTH0_DOMAIN,
        client_id: AUTH0_CLIENT_ID,
        redirect_uri: "https://ethantiller.github.io/TrafficMonitorNew/main.html"
    });

    const loginButton = document.getElementById('loginButton');
    const signinButton = document.getElementById('signinButton');

    loginButton.addEventListener('click', async () => {
        try {
            await auth0.loginWithRedirect();
        } catch (error) {
            console.error('Error logging in:', error);
        }
    });

    signinButton.addEventListener('click', async () => {
        try {
            await auth0.loginWithRedirect();
        } catch (error) {
            console.error('Error logging in:', error);
        }
    });

    const handleRedirectCallback = async () => {
        try {
            await auth0.handleRedirectCallback();
            window.location.href = '/main.html';
        } catch (error) {
            console.error('Error handling redirect callback:', error);
        }
    };

    if (window.location.search.includes('code=')) {
        handleRedirectCallback();
    }
});
