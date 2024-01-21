import {Router} from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

//User CRUD endpoints defined here

/*
curl -X POST -H "Content-Type: application/json"  -d "{\"content\": \"I'm crazily in love with myself\",  \"userId\": 1}"  http://localhost:8000/tweet
*/

//Create a tweet
router.post('/', async (req, res) => {
	const {content, image, userId} = req.body;
	
	try{
	
	   const result = await prisma.tweet.create({
		data: {
			content,
			image,
			userId //to manage based on the authenticated user
		},
	
	}); 
	
	res.json(result);
	
	} catch (e) {
	    res.status(400).json({error: "User not authenticated"});
	}
	
});




//List tweets
router.get('/', async (req, res) => {
	const allTweets =  await prisma.tweet.findMany();
	res.json(allTweets);
});




//get one tweet
router.get('/:id', async (req, res) => {
	const { id } =  req.params;
	const tweet = await prisma.tweet.findUnique({ where: {id: Number(id)} });
	
	if(!tweet) {
		return res.status(404).json({error: "Tweet not found!"});
		}
	return res.json(tweet);
	
});




/*
curl -X PUT -H "Content-Type: application/json"  -d "{\"content\": \"I'm crazily in love with myself and my other half\"}"  http://localhost:8000/tweet/1
*/

//update tweet
router.put('/:id', async (req, res) => {	
	const { id } =  req.params;
	const { content } = req.body;
	
	try{
	  const result = await prisma.tweet.update({
	    where: {id: Number(id)},
	    data: {content}
	  
	  })
	
	res.json(result);
	
	} catch (e) {
	    res.status(400).json({ error: 'Failed to update tweet' });
	}
});



// curl -X DELETE http://localhost:8000/tweet/1
//delete tweet
router.delete('/:id', async (req, res) => {
	const { id } =  req.params;
	await prisma.tweet.delete({where: {id: Number(id)}})
	res.sendStatus(200);
});

export default router;

