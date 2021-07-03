# SHORTIFY

Website Link: [Shortify](https://shtf.me/)

It is a URL-shortener made using NodeJS, ExpressJS and MongoDB.
You just have to visit the website and enter the URL you want to shorten.

If there already exists a short version of the requested URL, you will be provided that short URL.
If not, then a new short unique URL will be provided to you, which you can use for sharing.

# Steps to use it in your local system
1. Fork this repository and clone it to your local system.
2. Make sure you have nodejs and mongodb installed in your system beforehand.
3. Use the command `npm install` for installing the node modules in your command line. Move to the cloned directory in your terminal beforehand.
4. Open app.js in your code editor.
5. In place of `process.env.DB_URL` write `"mongodb://localhost:27017/myapp"`. This will make the mongodb connection of your app to myapp database in mongodb.
6. Replace `process.env.HOME_URL` with `"http://localhost:1000"` everywhere.
7. Start the mongodb server using the command `mongod` in the command line.
8. Write the command `npm run start` to start the server on port 1000 in command line. Make sure you are in the directory of the cloned repository before writing this command.

Enjoy!!!

