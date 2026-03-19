import express from 'express'

import { ENV } from './config/env.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen( ENV.PORT, () => {
    console.log(`Server running on PORT: ${ENV.PORT}`)
})