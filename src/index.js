import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db/index.db.js";

const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at: http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
