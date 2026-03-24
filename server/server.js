import dotenv from "dotenv";
dotenv.config({ path: "./DLS.env" });
import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
});

