# SHORTIFY

It is a URL-shortener made using NodeJS, ExpressJS and MongoDB.

You just have to visit the website and enter the URL you want to shorten.

If there already exists a short version of the requested URL, you will be provided that short URL.
If not, then a new short unique URL will be provided to you, which you can use for sharing.

#Steps to use it in your local system
1. Fork this repository and clone it to your local system.
2. Make sure you have nodejs and mongodb installed in your system beforehand.
3. Use the command `npm install` for installing the node modules in your command line.
4. In place of `process.env.DB_URL` write `'mongodb://localhost:27017/myapp'`. This will make the mongodb connection of your app to myapp database in mongodb.
5. Start the mongodb server using the command `mongodb` in the command line.
6. Write the command `npm run start` to start the server on port 1000. Make sure you are in the directory of the cloned repository before writing this command.

Enjoy!!!

