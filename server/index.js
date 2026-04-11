import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/connectDatabase.js";
import { initializeStore } from "./data/store.js";

const port = Number(process.env.PORT) || 5000;

await connectDatabase();
await initializeStore();

app.listen(port, () => {
  console.log(`EMS API running at http://localhost:${port}`);
});
