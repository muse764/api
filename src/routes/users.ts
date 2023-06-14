import { type Router } from "express";

import {
  createUserController,
  deleteSingleUserController,
  getAllUsersController,
  getSingleUserController,
  updateSingleUserController,
} from "../controllers";
import { authorize, isAuthenticated } from "../middlewares";

export default (router: Router) => {
  router.post("/users", createUserController);
  router.get("/users", getAllUsersController);
  router.get(
    "/users/:id",
    isAuthenticated,
    authorize("ADMIN", "MODERATOR", "SUPERADMIN"),
    getSingleUserController
  );
  router.put(
    "/users/:id",
    isAuthenticated,
    authorize("ADMIN", "MODERATOR", "SUPERADMIN"),
    updateSingleUserController
  );
  router.delete("/users/:id", deleteSingleUserController);
};
