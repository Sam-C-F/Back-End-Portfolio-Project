# Back-End Portfolio Project - NC-News

[Click this link to view the hosted version of this project](https://back-end-portfolio-project.herokuapp.com/)

This project is an **API**, mimicking a real world back-end service that is ready to provide information to front-end architecture.

To use this project in your local environment use **git clone** on the following URL:
`https://github.com/Sam-C-F/Back-End-Portfolio-Project.git`

## Before running this database -

Run **npm install** to add all dependencies and devDepencies needed for the project to run.

You will need to manually run:
`db/setup.sql`
To create the tables for the seed to populate.

Create a file in the main **BE-NE-NEWS** folder called:
`.env.development`

and include the following in the file:

`PGDATABASE=nc_news`

Then create a file in the main **BE-NE-NEWS** folder called:
`.env.test`

and include the following in the file:

`PGDATABASE=nc_news_test`

**npm start** can be used to run the server locally.

## Testing

Tests can be run using either:

`__tests__/utils.test.js`

To test the **utility fuctions**

or

`__tests__/app.test.js`

To test the **app functions**

## NOTE Minimum Requirements

**node** `v18.4.0`

**postgres** `v14.5`
