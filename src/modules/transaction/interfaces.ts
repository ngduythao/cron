import { BigNumberish } from "ethers";

interface ITransaction {
    to: string;
    value?: string;
    data?: string;
    nonce?: number;
    gasLimit?: string;
}

interface EIP1559Transaction extends ITransaction {
    maxFeePerGas: BigNumberish;
    maxPriorityFeePerGas: BigNumberish;
}

interface EIP2930Transaction extends ITransaction {
    gasPrice: string;
}

export type EIP1559TransactionMap = {
    [chainId: string]: EIP1559Transaction;
};

export { ITransaction, EIP1559Transaction, EIP2930Transaction };
