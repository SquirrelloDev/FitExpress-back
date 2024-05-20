# FitExpress - a diet food catering service
This repository contains source code of the FitExpress app. To be precise, the backend server serving as a REST API.

FitExpress is a diet food catering service build with PWA capibilities which primary goal is to help the users to lose weight by providing the personalized plans.

## Table of Contents
- [Techstack](#techstack)
- [Features](#features)
- [Instalation](#installation)
## Techstack
Technologies and libraries used for building the server:
- node.js
- express.js
- mongoose
- bcrypt
- cors
- jsonwebtoken
- multer
- node-cron
- nodemailer
- nodemailer-brevo-transport
- stripe
- web-push
- dotenv
## Features
- Fully functioning RESTful API
- Encrypting data via bcrypt
- JWT for authentication
- Uploading images via multer
- Task automation via cron jobs with help of node-cron package
- Sending emails to the users
- Backend payment handling with Stripe (and Stripe webhooks)
- Generating push notifications for the client
## Instalation
1. Clone the the repository:
```shell
git clone https://github.com/SquirrelloDev/FitExpress-back.git
```
2. Install dependencies
```shell
npm install
```
3. Run the local server
```shell
npm run start
```