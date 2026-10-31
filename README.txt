DAYFORM — LOCAL SETUP

1. Install Node.js LTS from https://nodejs.org/ (if it is not installed).
2. Open this Dayform-App folder in VS Code.
3. In VS Code choose Terminal > New Terminal.
4. Run: npm install
5. Copy .env.example and name the copy .env
6. Open .env and replace SESSION_SECRET with a long random string. Keep this file private.
7. Run: npm start
8. Open http://localhost:5500 in Chrome.

Google OAuth setup:
- The included Client ID is already configured in index.html and .env.example.
- In Google Cloud Console > Google Auth Platform > Clients, ensure Authorized JavaScript origins includes http://localhost:5500.
- If the Google consent screen is in Testing, add the Google account you will use under Audience > Test users.
- Never put a Google Client Secret in index.html. This Google Identity Services flow verifies the ID token on the local Node server.

IMPORTANT CURRENT LIMITATION:
Google sign-in is verified by the local server and a session is created. Habit data is still stored in this browser's local storage, as in the original standalone app. Cloud sync across devices and per-account cloud data storage are a separate next step and are not included yet.
