document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize Auth0 with environment variables
    const auth0 = new Auth0Client({
        domain: dev-h2kl7dklje1ovh16.us.auth0.com,
        client_id: IZD9ObtBRNHd1IXlJY3avZqTkpB3Fs4r,
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
