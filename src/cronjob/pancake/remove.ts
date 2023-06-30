import { Contract } from "ethers";
import { CronjobService } from "@cronjob";
import { TransactionService } from "@modules/transaction/";
import { PancakeService } from "@/modules/pancake";
import { envConfig } from "@config/config";
import pancakeRouterAbi from "@config/abi/pancake-router.json";

const pancakeService = new PancakeService();

export default class RemoveLiquidityTask extends CronjobService {
    txService: TransactionService;
    pancakeRouterContract: Contract;
    liquidityAmount: bigint;

    constructor(
        cronTime: string,
        txService: TransactionService,
        liquidityAmount: bigint,
    ) {
        super(cronTime);
        this.txService = txService;
        this.pancakeRouterContract = new Contract(
            envConfig.PANCAKE_ROUTER,
            pancakeRouterAbi,
            this.txService.provider,
        );
        this.liquidityAmount = liquidityAmount;
    }

    onTick(): () => void {
        return () => {
            this.processing();
        };
    }

    async processing(): Promise<void> {
        const owner = await this.txService.getAddress();
        const data = await pancakeService.removeLiquidityETHWithPermit(
            owner,
            this.liquidityAmount,
        );
        try {
            const transaction = {
                to: envConfig.PANCAKE_ROUTER,
                data,
            };

            const tx = await this.txService.sendTransaction(transaction);
            await tx?.wait();
        } catch (error) {
            console.log(`Transaction failed with error: ${error}`);
        }
    }
}
