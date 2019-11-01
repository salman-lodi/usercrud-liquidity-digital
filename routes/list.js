module.exports = [
  {
    method: "GET",
    path: "/users/",
    name: "get users",
    controller: "api",
    action: "getUsers"
  },
  {
    method: "GET",
    path: "/",
    name: "index",
    controller: "api",
    action: "hello"
  },
  {
    method: "GET",
    path: "/users/:_id",
    name: "get user by id",
    controller: "api",
    action: "getUserById"
  },
  {
    method: "PUT",
    path: "/users/:_id",
    name: "update by id",
    controller: "api",
    action: "updateUserById"
  },
  {
    method: "DELETE",
    path: "/users/:_id",
    name: "delete by id",
    controller: "api",
    action: "deleteUserById"
  },
  {
    method: "POST",
    path: "/token/generate-token",
    name: "generate token",
    controller: "api",
    action: "signin"
  },
  {
    method: "POST",
    path: "/users/",
    name: "create user",
    controller: "api",
    action: "signup"
  },
  {
    method: "GET",
    path: "/user/generateToken",
    name: "temp method to generate token",
    controller: "temp",
    action: "generateToken"
  },
  {
    method: "POST",
    path: "/department/",
    name: "Add a deparment",
    controller: "department",
    action: "create"
  },
  {
    method: "GET",
    path: "/department/",
    name: "Get deparment",
    controller: "department",
    action: "get"
  }
];
