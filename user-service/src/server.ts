import app from "./app";
import { appConfig } from "./config/config";

const PORT = appConfig.APP_PORT;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
