import express from 'express';
import cors from 'cors';
import checkerRoutes from './route/check.route.js'
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json())


app.use('/check', checkerRoutes)


app.listen(port, () => {
  console.log(`listening on port ${port}`);
})