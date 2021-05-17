## Swagger Specification

- [Orders Service](http://localhost:3000/api/)
- [Payments Service](http://localhost:3000/api/)
## How to run in development

You can can clone this app to your local marchine and run it as local development.
Please follow these steps

1. Go to project
    ```
    cd entry-test-setel
    ```
2. Start application server
    ```
    make up
    ```
3. Get auth token

    Go to `http://localhost:3000/api/#/auths/AuthController_login` and input login data:
    ```
    {
      "username": "admin",
      "password": "1"
    }
    ```
    then pass auth token to entry-test-setel/web/src/api/constant.js

## Tests

* To run all tests
  ```
  cd orders && npm test
  cd payments && npm test
  ```