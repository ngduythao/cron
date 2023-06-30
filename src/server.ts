import { app } from "@app";
import { TransactionService } from "@modules/transaction";
import { SupportedChainId } from "@config/constant";
import { envConfig } from "@config/config";
import { UnlockLiquidityTask, RemoveLiquidityTask } from "@cronjob";

const port = app.get("port");

const locksData = [
    {
        id: 1176,
        token: "0xFa24d6dFc98f66Fb525C8b1d2113352251344772",
        owner: "0xC48556E81e638bB5DEE7184644eDBCd3852979BD",
        amount: BigInt("21143940030183588224"),
        start: "1636041644",
        unlockDate: "1722441644", //  July 31, 2024 4:00:44 PM
    },
    {
        id: 3556,
        token: "0xFa24d6dFc98f66Fb525C8b1d2113352251344772",
        owner: "0xC48556E81e638bB5DEE7184644eDBCd3852979BD",
        amount: BigInt("18162292825170561248"),
        start: "1637853673",
        unlockDate: "1722441600", // July 31, 2024 4:00:00 PM
    },
    {
        id: 4081,
        token: "0xFa24d6dFc98f66Fb525C8b1d2113352251344772",
        owner: "0xC48556E81e638bB5DEE7184644eDBCd3852979BD",
        amount: BigInt("1072277483952015128"),
        start: "1638146777",
        unlockDate: "1722441600", // July 31, 2024 4:00:00 PM
    },
];

const totalAmount = BigInt(40378510339306164600);

const server = app.listen(port, onListening);
server.on("error", onError);

function onListening() {
    const addr = server.address();
    const bind =
        typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
    console.log(`Listening on ${bind}`);

    const transactionService = new TransactionService(envConfig.RPC, SupportedChainId.BSC);

    new UnlockLiquidityTask(envConfig.removeTime, transactionService, locksData.map(lockData => lockData.id)).start();

    // new RemoveLiquidityTask(envConfig.removeTime, transactionService, totalAmount).start();
   
}

function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
}

export default server;
