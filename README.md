# LocalForge iOS (Expo)

Mobile vertical slice of [laganinii/localforge](https://github.com/laganinii/localforge) — lead finder dashboard for TestFlight.

## Bundle
- iOS: `com.laganinii.localforge`
- Apple Team (Gaj): `ZLM4K5RVQW`

## Features (offline demo)
- Cork-flavoured mock leads in AsyncStorage
- Status filters (New / Contacted / Sold / Not Interested)
- Lead detail: Call, SMS, notes, pipeline status, demo call script

## Dev
```bash
npm install
python3 scripts/gen-icons.py
npx expo start
```

## TestFlight (Mac / EAS)
```bash
npm i -g eas-cli
eas login
eas build:configure
eas build --platform ios --profile production
eas submit --platform ios --latest
```
Create App Store Connect app record once if missing. Do not submit for App Store review until ready.

Box path: `/workspace/overnight-2026-09-28/apps/localforge-ios/`
