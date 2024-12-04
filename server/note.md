1. what is use of next()
=> The next() function is essential in Express.js for:
Moving to the next middleware or route handler.
Managing errors.
Controlling the flow of the request-response lifecycle.

Note: Token is generate after signin

//Authantication Backend process

2. Sign-up process
 Read incoming data like:name,email and password
 Validate if the data is ok or not.
 Send error if not.
 Check if we already have account with same user
 send error if yes yes otherwise create new accound and save user inside DB.
 Generate and store verification token.
 Send vverification link with token to register email
 send message back to email 

 3. Verify email
 Read incoming user token and id
 Find the token inside DB (using owner_id)
 Send error if token not found.
 Check token is valid or not
 if not valid send error otherwise update user is verified.
 Remove token from database
 Send sucess message

 4. Sign in
 Read incoming data like: email and password
 Find user with the provided email
 Send error if user not found
 Check if the password is Valid or not (becase psw is in encrypted form)
 if not Valid send error otherwise generate two token access token (becase its live 15 miniutes only so we generate refresh token) & refresh token
 store refresh token inside DB
 Send both token to user.
 