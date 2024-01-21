import {Router} from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';


const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const API_TOKEN_EXPIRATION_HOURS = 12; //keep users logged in for twelve hours (then they can go to sleep hahaha)
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET'; 

const router = Router();
const prisma = new PrismaClient();


//generate a random 8 digit number as the email token
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random()*90000000).toString();
}



function generateAuthToken(tokenId: number): string {
 const jwtPayLoad = { tokenId };
 
 return jwt.sign(jwtPayLoad, JWT_SECRET, {
   algorithm: "HS256",
   noTimestamp: true,
   
 });
}


//Create a user if it doesn't exist
//generate the emailToken and send it to their email

/*

curl -X POST -H "Content-Type: application/json"  -d "{\"email\": \"hittinghard@gmail.com\"}"  http://localhost:8000/auth/login

*/

router.post('/login', async (req, res) => {
	const {email} = req.body;
	
	//generate token
        const emailToken = generateEmailToken();
        const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 *1000 );  //it's in milliseconds
        
        try {
             const createdToken = await prisma.token.create({
            data: {
              type: "EMAIL",
              emailToken,
              expiration,
              user: {
                connectOrCreate: {
                  where: { email}, 
                  create: { email },
                },
              },
            },
        });
        
        console.log(createdToken);
        //send emailToken to user's email
        
        res.sendStatus(200);
        } catch (e) {
            console.log(e);
            res.status(400).json({error: "Couldn't start the authentication process" })
        }
     
});



//Validate the emailToken 
//Generate a long-lived JWT token

/*

curl -X POST -H "Content-Type: application/json"  -d "{\"email\": \"hittinghard@gmail.com\", \"emailToken\": \"61680112\" }"  http://localhost:8000/auth/authenticate

*/


router.post('/authenticate', async (req, res) => {
	const {email, emailToken} =  req.body;
	
	
	const dbEmailToken = await prisma.token.findUnique({
		where: {emailToken},
		include: {user: true},
	});
	
	console.log(dbEmailToken);
	
	//token exists in our database
	if(!dbEmailToken || !dbEmailToken.valid) {
	  return res.sendStatus(401);
	}
	
	//token is not expired
	if (dbEmailToken.expiration < new Date()) {
	 return res.status(401).json({error: "Token has expired!"});
	 
	}
	
	//token belongs to user that claims to be the user
	if (dbEmailToken.user?.email !== email) {
	  return res.sendStatus(401);
	}
	
	//We have validated that user is owner of the email
	//Generate an API token
	
	const expiration = new Date(new Date().getTime() + API_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000 ); 
	
	const apiToken = await prisma.token.create({
	  data: {
	    type: "API",
	    expiration,
	    user: {
	      connect: {
	        email,
	      }
	    } 
	  }
	})
	
	
	//Invalidate the email token
	
	await prisma.token.update({
	 where: { id: dbEmailToken.id },
	 data: { valid: false },
	 
	})
	
	
	//generate the JWT Token
	const authToken = generateAuthToken(apiToken.id);
	
	res.json({ authToken });
	

})



export default router;
