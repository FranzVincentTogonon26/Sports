import express from 'express'

import { ENV } from './config/env.js'
import matchRouter  from './routes/matchRouter.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/matches', matchRouter);

app.listen( ENV.PORT, () => {
    console.log(`Server running on PORT: ${ENV.PORT}`)
})