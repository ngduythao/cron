import { Interface } from "ethers";
import pinklockAbi from "@config/abi/pinklock.json";
const pinksaleInterface = new Interface(pinklockAbi);

export default class PinksaleService {
    getUnlockData(lockId: number): string {
        return pinksaleInterface.encodeFunctionData("unlock", [lockId]);
    }
}
