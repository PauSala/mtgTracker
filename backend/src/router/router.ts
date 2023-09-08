import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../spec/swagger.json";

const router = express.Router();
/**Swagger file */
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument));
export default router;
