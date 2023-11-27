import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import chalk from "chalk";

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.get('/api', (_req, res) => {
    const path = `/api/events`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`Hello! Go to events: <a href="${path}">${path}</a>`);
});

app.get("/api/events", (_req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ name: 'John Doe' });
})

const expressAppPort = process.env.EXPRESS_APP_PORT!
app.listen(expressAppPort, () => {
    console.log(chalk.bgBlue("EXPRESS STARTED"), chalk.blue(`port -> "${expressAppPort}"`))
})

export default app
