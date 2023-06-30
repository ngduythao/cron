import {
    Interface,
    JsonRpcProvider,
    Wallet,
    Signature,
    Contract,
} from "ethers";
import { envConfig } from "@config/config";
import { SupportedChainId } from "@config/constant";
import pancakeAbi from "@config/abi/pancake-router.json";
import erc20PermitAbi from "@config/abi/erc20-permit.json";
import ethSigUtil from "@metamask/eth-sig-util";

const pancakeInterface = new Interface(pancakeAbi);

const token = new Contract(
    envConfig.LP_TOKEN,
    erc20PermitAbi,
    new JsonRpcProvider(envConfig.RPC),
);

const domain = {
    name: "Pancake LPs",
    version: "1",
    chainId: SupportedChainId.BSC,
    verifyingContract: envConfig.LP_TOKEN,
};

const types: ethSigUtil.MessageTypes = {
    EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
    ],
    Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
    ],
};

export default class PancakeService {
    async removeLiquidityETHWithPermit(
        owner: string,
        liquidity: bigint,
    ): Promise<string> {
        const nonce = await token.nonces(owner);
        const deadline = Math.round(Date.now() / 1000) + 600; // 10 minutes
        const [v, r, s] = this.getPermitSignature(
            owner,
            envConfig.PANCAKE_ROUTER,
            liquidity,
            nonce,
            deadline,
        );
        return pancakeInterface.encodeFunctionData(
            "removeLiquidityETHWithPermit",
            [token, liquidity, 0, 0, owner, deadline, false, v, r, s],
        );
    }

    getPermitSignature(
        owner: string,
        spender: string,
        value: bigint,
        nonce: bigint,
        deadline: number,
    ): [27 | 28, string, string] {
        const message = {
            owner,
            spender,
            value,
            nonce,
            deadline,
        };

        const primaryType = "Claim";

        const data: ethSigUtil.TypedMessage<typeof types> = {
            domain,
            types,
            primaryType,
            message,
        };
        const privateKey = Buffer.from(envConfig.OWNER_KEY, "hex");

        const signature = ethSigUtil.signTypedData({
            privateKey,
            version: ethSigUtil.SignTypedDataVersion.V4,
            data,
        });

        const { v, r, s } = Signature.from(signature);
        return [v, r, s];
    }
}
