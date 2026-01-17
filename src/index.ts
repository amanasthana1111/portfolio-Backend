import express from "express";
import type { Request, Response } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import Visitor from "./models/Visitor.js";
import "dotenv/config";
import { env } from "./config/envConfig.js";
import { connectDB } from "./DB/dbconnection.js";
import cors from "cors";

const app = express();

declare module "express-session" {
  interface SessionData {
    hasVisited: boolean;
  }
}

app.use(
  cors({
    origin: ["https://aman-asthana.vercel.app" , "http://localhost:5173"],
    credentials: true,
  }),
);

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: env.MONGODB_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 5,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    },
  }),
);


app.get("/api/visit", async (req, res) => {
  console.log("SessionID:", req.sessionID);
  console.log("Visited before:", req.session.hasVisited);

  if (req.session.hasVisited !== true) {
    const data = await Visitor.findOneAndUpdate(
      { counterName: "total_visitors" },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    req.session.hasVisited = true;

    return req.session.save(() => {
      res.json({ total: data.count, mess: "New User" });
    });
  }

  const data = await Visitor.findOne({ counterName: "total_visitors" });
  return res.json({ total: data?.count, mess: "Old User" });
});

const main = async () => {
  try {
    await connectDB();
    app.listen(5000, () => console.log("Server running on port 5000"));
  } catch (error) {
    console.log(error);
  }
};

main();
