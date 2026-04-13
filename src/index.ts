import express from "express";
import type { Request, Response } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import Visitor from "./models/Visitor.js";
import "dotenv/config";
import { env } from "./config/envConfig.js";
import { connectDB } from "./DB/dbconnection.js";
import cors from "cors";
import { BlogModel } from "./models/Blog.js";

const app = express();
app.use(express.json());
app.set("trust proxy", 1);
declare module "express-session" {
  interface SessionData {
    hasVisited: boolean;
  }
}

app.use(
  cors({
    origin: ["https://aman-asthana.vercel.app"],
    credentials: true,
  }),
);

app.use(
  session({
    name: "visitor.sid",
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: env.MONGODB_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 5,
      httpOnly: true,
      secure: true,        // MUST be true in production
      sameSite: "none",    // REQUIRED for cross-site cookies
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
      { upsert: true, new: true },
    );

    req.session.hasVisited = true;

    return req.session.save(() => {
      res.json({ total: data.count, mess: "New User" });
    });
  }

  const data = await Visitor.findOne({ counterName: "total_visitors" });
  return res.json({ total: data?.count, mess: "Old User" });
});

app.get("/blogs", async (req, res) => {
  try {
    const data = await BlogModel.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
});


app.get("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await BlogModel.findOne({ id });

    if (!data) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blog" });
  }
});

app.post("/blogs/edit", async (req, res) => {
  try {
    const { id, title, desc, tags, imglink, paragraphs, moreImg } = req.body;

    const newBlog = new BlogModel({
      id,
      title,
      desc,
      tags,
      imglink,
      paragraphs,
      moreImg
    });

    const savedBlog = await newBlog.save();

    res.status(201).json(savedBlog);

  } catch (err) {
    res.status(500).json({ message: "Error creating blog" });
  }
});

app.get("/",(req,res)=>{
  res.json({
    mess : "Server is fine"
  })
})

const main = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => console.log("Server running on port " + process.env.PORT));
  } catch (error) {
    console.log(error);
  }
};

main();
