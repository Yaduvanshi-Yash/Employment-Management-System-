import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/connectDatabase.js";
import { initializeStore } from "./data/store.js";
<<<<<<< HEAD
=======
import { testEmailConnection } from "./services/emailService.js";
>>>>>>> 2e1ece7 (Flatten project structure and finalize full-stack EMS setup)

const port = Number(process.env.PORT) || 5000;

await connectDatabase();
await initializeStore();
<<<<<<< HEAD
=======
await testEmailConnection();
>>>>>>> 2e1ece7 (Flatten project structure and finalize full-stack EMS setup)

app.listen(port, () => {
  console.log(`EMS API running at http://localhost:${port}`);
});
