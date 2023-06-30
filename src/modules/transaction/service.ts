import {
    JsonRpcProvider,
    Provider,
    Wallet,
    NonceManager,
    TransactionResponse,
} from "ethers";
import { ITransaction, EIP1559Transaction } from "./interfaces"; // Polygon, Avalanche
import { SupportedChainId } from "@config/constant";
import { envConfig } from "@config/config";


export default class TransactionService {
    chainId: SupportedChainId;
    provider: Provider;
    owner: NonceManager;

    constructor(rpcUrl: string, chainId: SupportedChainId) {
        this.provider = new JsonRpcProvider(rpcUrl);
        this.chainId = chainId;
        const account = new Wallet(envConfig.OWNER_KEY).connect(this.provider);
        this.owner = new NonceManager(account);
    }

    async getAddress(): Promise<string>{
        return this.owner.getAddress();
    }

    async sendTransaction(
        transaction: ITransaction | EIP1559Transaction,
    ): Promise<TransactionResponse | undefined> {
        const wallet = this.owner;
        try {
            await wallet?.estimateGas(transaction);
            return wallet
                ?.sendTransaction(transaction)
                .then(transactionReceipt => {
                    return transactionReceipt;
                })
                .catch(error => {
                    throw error;
                });
        } catch (error) {
            throw error;
        }
    }
}
