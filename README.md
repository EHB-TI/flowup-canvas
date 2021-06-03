# flowup-canvas
Integration Project - Groep 2 - Canvas

First clone the repository

```
git clone https://github.com/EHB-TI/flowup-canvas.git
```

Go to the directory that you just cloned and install all of the node dependencies

```
cd flowup-canvas
./flowup-canvas$ npm install
```
Go to the home directory of your machine and provide 2 environment files.

The first one will be .env and this will contain the environment variables for your production environment , the second one will be .env.example and this one will contain the environment variables that will be used for your test environment. 

For an example please check the .env.example file in this repository. You can find the detailled information about each environment variable in the table below.

| Environment variable  | Value |
| ------------- | ------------- |
| AMQP_URL  | The host of your RabbitMQ instance |
| API_TOKEN  | API token that is generated by the administrator account of the Canvas instance |
| BASEURL  | http(s):// your domain name or IP /api/v1 |
| SIS_EVENTCOURSE_ID  | Unique Id that you specify in the course that you want to use to store and manage your events within the institution|
| HOST | The host of your mysql database |
| USER | The username of the user of your database |
| PASSWORD | The password of the user of your database |
| DB | The name of your database |
| CALENDARSTABLE | The name of the table that you use to link an event to a calendar event |
| ACCOUNT | The account id of your organization | 

If all of that is done then you are ready to go to start our application

**NOTE**: You have to install Canvas on your machine in order to use our application , please go to (https://github.com/instructure/canvas-lms) for detailed information about the installation of Canvas
