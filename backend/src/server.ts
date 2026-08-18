import express, { Application, Request, Response } from "express";
import { listen } from "node:quic";

const app: Application = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the backend");
});

app.listen(port, () => {
  console.log(`Server is running in http://localhost:${port}`);
});
