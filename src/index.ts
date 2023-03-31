import express from 'express';
import { router } from './routes/loginRoutes';
import cookieSession from 'cookie-session';

console.log('Hi');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieSession({ keys: ['someString'] }));
app.use(router);

app.listen(3000, () => {
	console.log('Listening on port 3000');
});
