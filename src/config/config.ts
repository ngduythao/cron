import Joi from "joi";
import "dotenv/config";

const envVarsSchema = Joi.object()
    .keys({
        PORT: Joi.number().default(3000),
        RPC: Joi.string().required().description("BSC RPC"),
        PINKSALE_ADDRESS: Joi.string().required().description("Pinksale lock"),
        LP_TOKEN: Joi.string().required().description("Nelo LP token"),
        PANCAKE_ROUTER: Joi.string()
            .required()
            .description("Pancakeswap router"),
        OWNER_KEY: Joi.string().required().description("Owner key"),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const envConfig = {
    port: envVars.PORT,
    RPC: envVars.RPC,
    PINKSALE_ADDRESS: envVars.PINKSALE_ADDRESS,
    LP_TOKEN: envVars.LP_TOKEN,
    PANCAKE_ROUTER: envVars.PANCAKE_ROUTER,
    OWNER_KEY: envVars.OWNER_KEY,
    unlockTime: `* 5 16 31 7 *`, // “At 16:05 on day-of-month 31 in July.”
    removeTime: `* 10 16 31 7 *`, // “At 16:10 on day-of-month 31 in July.”
};

// export default config;
