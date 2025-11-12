import { loggerMiddleware } from "#middlewares/logger.middleware";
import { cryptoRouter } from "#routes/crypto.routes";
import { signatureRouter } from "#routes/signature.routes";
import compression from "compression";
import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());

app.use(express.json({ limit: "2mb" }));
app.use(compression());

if (process.env.DISABLE_LOGGING !== "true") {
  app.use(loggerMiddleware);
}

app.use(cryptoRouter);
app.use(signatureRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello, Friend." }); // https://youtu.be/pCKDrDvaOKE
});

app.listen(port, () => {
  console.log(`\n✅ Server running on http://localhost:${String(port)}\n`);
});
