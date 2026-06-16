import express from "express";
import routes from "./src/routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/common/config/swagger.config.js";

const app = express();

app.set("json replacer", (key, value) =>
    typeof value === "bigint" ? value.toString() : value
);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// all routes mount
app.use("/api", routes);

export default app;