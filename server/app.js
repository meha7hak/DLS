// import express from "express";
// import cors from "cors";
// const app = express();
// app.use(cors());
// app.use(express.json());

// import authRoutes from "./routes/authRoutes.js";

// app.use("/api/auth", authRoutes);
// console.log("PORT:", process.env.PORT);
// app.get("/", (req, res) => {
//     res.send("API IS RUNNING");
// });

// app.get("/api/test", (req, res) => {
//     res.json({ message: "Backend connected successfully!" });
// });

// export default app;

// import express from "express";

// const app = express();

// app.get("/", (req, res) => {
//     res.send("API is working");
// });

// export default app;

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route (keep this ALWAYS for debugging)
app.get("/", (req, res) => {
    res.send("API working");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);

export default app;