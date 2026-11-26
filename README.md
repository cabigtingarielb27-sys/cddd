# WalletX Starter

An offline-first **demo e-wallet frontend** built with HTML, CSS, JavaScript, Vite and Capacitor. It is designed to be pushed to GitHub, previewed in a browser, and packaged as an Android APK.

## Included
- Mobile-first wallet dashboard
- Demo balance and simulated transfer flow
- Receive reference, bill/load sample screens
- Transaction history, savings goal, profile/settings
- Local device persistence with `localStorage`
- Pending demo activity queue and a placeholder sync adapter
- JSON backup export
- Capacitor Android wrapper configuration

## Important safety and production limits
This is a prototype only. It does not hold funds and does not perform real transfers, deposits, withdrawals, bill payments, or mobile load purchases. Do not collect real passwords, PINs, OTPs, bank details, identity documents, or payment credentials in this demo.

For a real financial product, engage appropriately licensed financial institutions/payment providers and qualified security/compliance professionals. Build all balance changes and transaction decisions on the trusted backend. Do not trust balances, amounts, ownership, or transaction status supplied by a mobile client. Use server-side authentication, authorization, idempotency keys, audit logs, rate limits, encryption, fraud controls, backups, and a formal dispute/reversal process. Offline actions must remain clearly pending until the backend confirms them.

## Run locally
Install Node.js LTS, then:

```bash
npm install
npm run start
```

Open the local URL printed by Vite.

## Push to GitHub
Create a repository, then from this folder:

```bash
git init
git add .
git commit -m "Initial WalletX frontend"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Build Android APK
Android APK builds require Android Studio, Android SDK, and a compatible JDK installed on your computer.

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

In Android Studio, wait for Gradle sync, then use **Build > Build Bundle(s) / APK(s) > Build APK(s)**. For later frontend changes run `npm run build` and `npx cap sync android` again.

## Connect Base44
1. Create and deploy your Base44 backend app.
2. Implement authenticated server functions for the features you need.
3. Configure `API_BASE_URL` in `config.js` to the HTTPS base URL of your deployed backend function/API.
4. Set `DEMO_MODE` to `false` only after the backend endpoints and authentication have been implemented and tested.
5. Update `syncPending()` in `app.js` to match the exact request/response contract of your Base44 function.
6. Never put private API keys or admin credentials in this GitHub frontend. The mobile app is inspectable by users.

The current sync method is a placeholder for **demo activity only**. It is not suitable for real-money ledger synchronization.

## Suggested next development phases
1. Build and test the Base44 demo backend and authentication.
2. Add user-specific data access rules and server-side audit records.
3. Implement a proper double-entry ledger and reconciliation process with a regulated provider before any real-money capability.
4. Add secure session handling, device registration, and conflict-safe offline synchronization.
