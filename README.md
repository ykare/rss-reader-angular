# rss-reader-angular

Angular RSS reader sample

## setup

### create firebase project

<https://firebase.google.com/>

and add Web App

### install firebase CLI

```bash
npm install -g firebase-tools
```

### setup firebase environment

```bash
cd $PROJECT_DIR
firebase login
firebase init
...
your choices.
 (*) Database:
 (*) Functions:
 (*) Hosting:
```

```bash
firebase deploy --only functions
```

check cloud functions url!

copy src/environments/environment.sample.ts {environment.prod.ts,environment.ts}
modify firebase information

### setup project

```bash
cd $PROJECT_DIR
npm install
```

### start local dev server

```bash
ng serve
```

### deploy hosting & functions

```bash
ng build --prod
firebase deploy --only functions
firebase deploy --only hosting:{your hosting project}
```
