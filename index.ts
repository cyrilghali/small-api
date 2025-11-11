import { errorMiddleware } from "#middlewares/error.middleware";
import { cryptoRouter } from "#routes/crypto.routes";
import { sendSuccess } from "#utils/response.utils";
import express from "express";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/", (req, res) => {
  sendSuccess(res, {
    message: "Hello Riot ! ;) ",
  });
});

app.use("/", cryptoRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server listening on port ${String(port)}`);
});
