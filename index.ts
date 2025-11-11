import { errorMiddleware } from "#middlewares/error.middleware";
import { cryptoRouter } from "#routes/crypto.routes";
import { sendSuccess } from "#utils/response.utils";
import express from "express";

const app = express();
const port = process.env.PORT ?? 3000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  sendSuccess(res, {
    message: "Hello Riot ! ;) ",
  });
});

app.use("/", cryptoRouter);

// Error handling (must be last)
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
