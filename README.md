# Server to launch API for Real Estate project 🖥️

Server to run real estate project.

- [Deployed Version e.g.](https://shielded-journey-92023.herokuapp.com/advert/all)

#### Real Estate Client 🏘️

- [GIT repository of client](https://github.com/jkarelins/real-estate-site#real-estate-react-client-%EF%B8%8F)

# 🤖 Used Technologies

- [Node js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [PostgresQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [GitHub](http://github.com)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Sequelize](https://sequelize.org/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Heroku](https://heroku.com)
- [Node Cron](https://www.npmjs.com/package/node-cron)

## Installation & Setup Guide

- git clone git@github.com:jkarelins/real-estate-server.git
- PostgreSQL DB should be launched.
  e.g. run it in docker container
  Change configuration in /db.js - file
- cd real-estate-server
- npm install
- npm run start

## To run server on local machine 🔌

- [FREE Register on Cloudinary](https://cloudinary.com/signup)
- [FREE Create STRIPE Account](https://dashboard.stripe.com/register)
- Create .env file in root folder of project with folowing content:

CLOUDINARY_URL=Your cloudinary URL
CLOUD_NAME=Your cloud name
API_KEY=Cloudinary API KEY
API_SECRET=Cloudinary API secret
API_BASE_URL=Your Cloudinary base URL
SECURE_DELIVERY_URL=Your Cloudinary secure delivery URL

STRIPE_KEY=Your Stripe key - begins with sk test

## To deploy on Heroku 🔌

- Register FREE: [Create Heroku Account](https://signup.heroku.com/)
- Create new project
- After deployment go to project settings
- Setup Config Vars

CLOUDINARY_URL=Your cloudinary URL
CLOUD_NAME=Your cloud name
API_KEY=Cloudinary API KEY
API_SECRET=Cloudinary API secret
API_BASE_URL=Your Cloudinary base URL
SECURE_DELIVERY_URL=Your Cloudinary secure delivery URL

STRIPE_KEY=Your Stripe key - begins with sk test

## To test API is running 👍

Check any of server routes. e.g. /user or /advert/all
If App was first launched, should return empty array and Response code should be 200.
