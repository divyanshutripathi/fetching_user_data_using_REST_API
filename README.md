# fetching_user_data_using_REST_API

fetching User data from https://randomuser.me/ and storing it to mongo Db using REST API.

## Prerequisites

after cloning the project cd ./Backend

```
npm install
```

## Run the server

```
nodemon
```

## Routes

### To create the user on the local mongodb

GET Request

```
http://localhost:3000/users/addUser
```

It will fetch 100 records from https://randomuser.me/api and save them to mongodb

### For fetching report

POST Request

```
http://localhost:3000/users/report
body: {"gender":<gender>}
```
