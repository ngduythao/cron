import { Contract } from "ethers";
import { CronjobService } from "@cronjob";
import { TransactionService } from "@modules/transaction/";
import { PinksaleService } from "@/modules/pinksale";
import { envConfig } from "@config/config";
import pinksaleAbi from "@config/abi/pinklock.json";

const pinksaleService = new PinksaleService();

export default class UnlockLiquidityTask extends CronjobService {
    lockIds: number[];
    txService: TransactionService;
    pinksaleContract: Contract;

    constructor(cronTime: string, txService: TransactionService, lockIds: number[]) {
        super(cronTime);
        this.txService = txService;
        this.pinksaleContract = new Contract(
            envConfig.PINKSALE_ADDRESS,
            pinksaleAbi,
            this.txService.provider,
        );
        this.lockIds = lockIds;
    }

    onTick(): () => void {
        return () => {
            this.processing();
        };
    }

    async processing(): Promise<void> {
        for (let i = 0; i < this.lockIds.length; i++) {
            try {
                const transaction = {
                    to: envConfig.PINKSALE_ADDRESS,
                    data: pinksaleService.getUnlockData(this.lockIds[i]),
                };

                const tx = await this.txService.sendTransaction(transaction);
                await tx?.wait();
            } catch (error) {
                console.log(`Transaction failed with error: ${error}`);
            }
        }
    }
}
