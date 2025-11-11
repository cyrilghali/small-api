import { errorMiddleware } from "#middlewares/error.middleware";
import { cryptoRouter } from "#routes/crypto.routes";
import { signatureRouter } from "#routes/signature.routes";
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

app.use("/crypto", cryptoRouter);
app.use("/signature", signatureRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server listening on port ${String(port)}`);
});
