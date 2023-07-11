
# Your Best Shots

Your Best Shots is a website designed to help you dial in your morning (or afternoon, or night) espresso pulls. Just create an account, add your espresso machine, grinder, and beans to your personal dashboard; and start building your history of shots. By keeping track of things like the weight of your coffee grinds pre-pull and the weight of your shots post-pull, you'll be able inch closer and closer to your ideal shot without having to memorize every minute change you make every time you have to make an adjustment. 

## Features
* Normal users can:
  * Sign up and sign in
  * Add and remove espresso machines, grinders, beans, and shots to and from their accounts
  * Edit their shots
  * Submit new machines, grinders, and beans to be considered for addition to the public pool
  * Review their shot history
  * See shots pulled by other users
* Admins can:
  * Edit (make public) or delete (remove from review queue) user-submitted machines, grinders, and beans
* Everyone can:
  * Enjoy the dark mode toggle!

## Try it out now
The live site is hosted by Google Cloud at https://espresso-389812.ey.r.appspot.com.

## Run it locally

### Installation
`gh clone romeonicholas/espresso`

`npm install`

[Add the environmental variables noted below]

`npm run dev`

### Environment Variables

To run this locally, you'll need to add a few variables to a .env file. 

`MONGODB_URI`: For pointing Mongoose towards your local database. After installing MongoDB on your computer, you should be able to find this URI by running `mongosh` from your terminal.

`PORT`: The port you'd like to run your local server on. Depends on your local setup, but 3000 or 3001 are common.

`SECRET_JWT_CODE`: For JWT encryption. Can be whatever you like, but best practice suggests a 60+ character random string.

`JWT_EXPIRES_IN`: How long your JWT are valid, (e.g. '4d' for 4 days).

## Technologies

Your Best Shots utilizes:

* Express + EJS for routing and rendering
* MongoDB + Mongoose for database work
* JSONWebToken + bcrypt for auth
* Countless support modules, please see package.json for the full list

## License

https://mit-license.org