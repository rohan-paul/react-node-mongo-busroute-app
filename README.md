I have deployed the project is deployed in [here at Google Cloud Platform](https://cholo-app-exercise.appspot.com/_)

In this deployment, the MongoDB database is running in cloud MongoDB Atlas.

The rest of the backend, I have done in Node/Express. And in the front-end along with React, Redux I have heavily used Material-UI

### To launch this project in the local machine.

First of all update the .env file in both the project root and ./client folder

The project root's .env file contains variable for 'MONGO_DB' and ./client folder's env variable contains var for 'REACT_APP_GOOGLE_MAP_API'

run `npm install` in both the server and client directory seperately, which in this project is the root directory (`./`) and also `./client` directories respectively.

The mongodb of this project is hosted in cloud MongoDB atlas. The credentials are in .env file at the root of project.

If you want to instead run your local mongodb, then first change the .env file  start mongodb service with

`sudo service mongod start`

and then finally run the following command at the root of the project directory.

`npm run dev`

This will start both the client (port 3000) and server (port 8080) and launch the site in port 3000.

#### To build the project for production and serve the React static files from `/client/build` (i.e. do these steps before deploying to Google Cloud Platform's Google App Engine).

```
cd client

npm run build

cd ..

```

And check that everything is running properly

```
npm start

```
And then finally if I want the whole app to deploy to Google Cloud Platform, set up the **app.yaml** first. Its already setup here with some basic configurations.

To deploy the project in Google Cloud, you also need to set up the local mongo database to a cloudbased mongo service like Mongo Atlas

And then finally run below at the root of the project.

```
gcloud app deploy --stop-previous-version
```

### Other Commands

#### `npm test`

Launches the test runner in the interactive watch mode.<br>

#### To check the bundle size of overall app and various packages of the Client.

``cd client`` and then run

``npm run analyze``


#### Few Notes on the Features

- A. There are 2 Tables. One for Bus Routes and another for Bus Stops. You can toggle between the by clicking on the bottom Paper element. The Tables have sorting functionality for each of the table-heading.
- B. The edit / delete and export to CSV functionality will only be shown after selecting an item, conforming to Material-UI design principles.
 - C. For importing / or bulk uploading .csv file you can click on the bottom left corner Paper element. But the .csv file needs to be in a specific format to conform to the data-signature of the mongodb-schema of the relevant Table (BusRoutes or Bus Stops.). Hence in the root of the project, I have kept 2 .csv file one for bulk uploading to Bus Routes and one for bulk uploading to Bus Stops. For successful testing of this feature for now, please upload from only those 2 files.
 - I have been pushing the Project to a Private Repo in BitBucket, and have also pushed the .env file so you can run the project in you local machine as well.
 - Sometimes to see the Polymap just zoom out a little bit


#### Outstanding/Open Issues that I think I can resolve relatively quickly but today did not get any more time.

 - A. In the Form to add a new Bus Route, in the Bus Stop drop-down menu selection field, once a name is selected, the input field will not get empty automatically. So user has to manually clear the field by pressing backspace, and only then the other options will be shown in the dropdown.
 - B. The Polymap, i.e. the Bus icon on the right, if user clicks directly on the icon at first, the Polymap will not be rendered. The user needs to select the row or the item first, only then if he clicks on the bus icon image, the correct Polymap covering the Bus Stops of that Route will be rendered.