import { CronJob, CronCommand } from "cron";

// constructor(
//     cronTime: string | Date | DateTime,
//     onTick: CronCommand,
//     onComplete?: CronCommand | null,
//     startNow?: boolean,
//     timeZone?: string,
//     context?: any, runOnInit?: boolean,
//     utcOffset?: string | number,
//     unrefTimeout?: boolean
// );

export default abstract class CronjobService {
    private _instance: CronJob;

    constructor(cronTime: string | Date) {
        this._instance = new CronJob(cronTime, this.onTick());
    }

    public start(): void {
        this._instance.start();
    }

    protected abstract onTick(): CronCommand;
}
