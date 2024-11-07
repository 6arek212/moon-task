process.env.TZ = "UTC";
import Gateway from "./api/gateway";
import { initApplication } from "./application";
import { configs } from "./configs";



const run = async () => {
    console.log("server is starting");

    await initApplication()

    var apiGateway = new Gateway(configs.PORT)
    apiGateway.start()
};

run();