import express from 'express';
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middlewares/authMiddleware';

const app = express();
app.use(express.json());
app.use('/user', authenticateToken, userRoutes);
app.use('/tweet', authenticateToken, tweetRoutes);
app.use('/auth', authRoutes); //we do not add the token here because the user is not yet authenticated

app.get('/', (req, res) => {
 	res.send('Hello World UPdated');
});


app.listen(8000, () => {
	console.log('Server ready at localhost:8000');
});
