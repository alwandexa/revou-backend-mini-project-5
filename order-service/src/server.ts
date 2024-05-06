import app from "./app";
import { appConfig } from "./config/config";

const PORT = appConfig.APP_PORT || 3100;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
