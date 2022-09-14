# Back-End Portfolio Project - NC-News

[Click this link to view the hosted version of this project](https://back-end-portfolio-project.herokuapp.com/)

This project is an **API**, mimicking a real world back-end service that is ready to provide information to front-end architecture. **HTTP requests** can be performed to various **endpoints** which can be found on the **static landing page** or, in more detail, at **/api**.

To run this project in your local environment **fork** and **clone** [this repository](https://github.com/Sam-C-F/Back-End-Portfolio-Project.git).

## Before running this database -

This **API** relies on several dependencies including:

- dotenv
- express
- postgres (_pg_)

And the following developer dependencies used for testing:

- jest
- jest-sorted
- jest-extended
- supertest

Run **npm install** to add all dependencies and devDepencies needed for the project to run.

You will need to manually run:

`db/setup.sql`

To create the tables needed for the seed to populate. This can be done using the preprepared script: `npm run setup-dbs` and only needs to be run to initialize the database. Following this the script: `npm run seed` can be used to seed the development database.

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

As **TDD** has been used throughout the development process there is a full testing suite which can be found in the **tests** directory.

Tests can be run using either:

`npm test __tests__/utils.test.js`

To test the **utility fuctions**

or

`npm test __tests__/app.test.js`

To test the **app functions**

The database will be reset before running every test and will close automatically once the testing is complete.

## .gitignore

Finally, remember to set up a `.gitignore` file with the following to be included:

- node_modules
- .env\.\*

## NOTE Minimum Requirements

**node** `v14 or later`

**postgres** `v10 or later`
