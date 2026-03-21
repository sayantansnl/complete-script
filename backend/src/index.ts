import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { 
    middlewareHandleErrors, 
    middlewareLogResponse,
    middlewareIncrementServerHits 
} from "./api/middleware.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";
import { handlerCreateUser } from "./api/users.js";
import { handlerLogin } from "./api/auth.js";
import { config } from "./config.js";

const migrationClient = postgres(config.dbConfig.dbUrl, { max: 1 });
await migrate(drizzle(migrationClient), config.dbConfig.migration);

const app = express();

app.use(express.json());
app.use(middlewareLogResponse);

app.get("/admin/metrics", middlewareIncrementServerHits, handlerMetrics);
app.post("/admin/reset", handlerReset);

app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerCreateUser(req, res)).catch(next);
});

app.post("/api/login", (req, res, next) => {
    Promise.resolve(handlerLogin(req, res)).catch(next);
});

app.use(middlewareHandleErrors);

app.listen(config.apiConfig.port, () => {
    console.log(`Server listening on port:${config.apiConfig.port}`);
});