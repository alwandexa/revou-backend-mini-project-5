import app from "./app";
import { appConfig } from "./config/config";
import { InventoryService } from "./services/inventory-service";

const PORT = appConfig.APP_PORT;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});

InventoryService.checkInventoryRabbit();
// InventoryService.checkInventoryKafka();
