import {Router} from 'express';

const router = Router();


//User CRUD endpoints defined here

//Create a tweet
router.post('/', (req, res) => {
	res.status(501).json({ error: 'Not implemented' });
});


//List tweets
router.get('/', (req, res) => {
	res.status(501).json({ error: 'Not implemented' });
});


//get one tweet
router.get('/:id', (req, res) => {
	const { id } =  req.params;
	res.status(501).json({ error: 'Not implemented: ${id}' });
});

//update tweet
router.put('/:id', (req, res) => {
	const { id } =  req.params;
	res.status(501).json({ error: 'Not implemented: ${id}' });
});

//delete tweet
router.delete('/:id', (req, res) => {
	const { id } =  req.params;
	res.status(501).json({ error: 'Not implemented: ${id}' });
});

export default router;

