export enum SupportedChainId {
    BSC = 56,
    BSC_TESTNET = 97,
}

export type BlockTimestamp = {
    [chainId in SupportedChainId]: string;
};

export const blockTimestamp: BlockTimestamp = {
    [SupportedChainId.BSC]: "3",
    [SupportedChainId.BSC_TESTNET]: "3",
};
