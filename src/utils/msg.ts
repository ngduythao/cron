import chalk from "chalk";

const originalLog = console.log;
console.log = msg => originalLog(`[${getFormattedDate()}] ${msg}`);

const pad = (d: number) => (d < 10 ? `0${d}` : `${d}`);

const getFormattedDate = () => {
    const date = new Date();
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const str =
        `${date.getFullYear() 
        }-${ 
        date.getMonth() + 1 
        }-${ 
        date.getDate() 
        } ${ 
        date.getHours() 
        }:${ 
        minutes 
        }:${ 
        seconds}`;
    return str;
};

export default class Message {
    error(message: string): void {
        console.log(chalk.hex("#F62020")(message));
    }

    success(message: string): void {
        console.log(chalk.hex("#669EE8")(message));
    }

    primary(message: string): void {
        console.log(chalk.hex("#EBF0FA")(message));
    }

    warning(message: string): void {
        console.log(chalk.hex("#E8BF66")(message));
    }
}
