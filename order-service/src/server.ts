import app from "./app";
import { appConfig } from "./config/config";
// import { orderConsumer } from "./lib/kafka/order-consumer";
// import { orderProducer } from "./lib/kafka/order-producer";

const PORT = appConfig.APP_PORT || 3100;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});

// orderConsumer();