# HackathonRegistration

# Node Package Summary

## Dependencies
* **body-parser:** Parse incoming request bodies in a middleware before your handlers, available under the `req.body` property.
* **browser-sync:** Watches for changes you make to a web page and automatically updates the browser.
* **cookie-parser:** Parse Cookie header and populate `req.cookies` with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns `req.secret` so it may be used by other middleware.
* **del:** Deletes files and folders.
* **dotenv:** Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`.
* **ejs:** EJS, embedded javascript, is a templating language. EJS combines data and a template to produce HTML.
* **express:** A web application framework for Node.js designed for building web applications and APIs.
* **gulp:** Gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.
* **gulp-concat:** Concatenates files into a single file.
* **gulp-cssnano:** Minifies CSS.
* **gulp-nodemon:** Gulp-nodemon looks almost exactly like regular nodemon, but it's made for use with gulp tasks.
* **gulp-sass:** It allows you to natively compile .scss files to css.
* **gulp-sourcemaps:** Creates source maps for concatenated and minified css and javascript
* **gulp-uglify:** Minifies JavaScript.
* **mongoose:** Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
* **morgan:** HTTP request logger middleware for node.js
* **nodemon:** Nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.
* **run-sequence:** Runs a sequence of gulp tasks in the specified order
* **serve-favicon:** Node.js middleware for serving a favicon.
* **winston:** A logging library for node.js
* **winston-daily-rotate-file:** A transport for winston which logs to a rotating file.

## Environment variables
* HTTPS_PORT
* MONGODB_URI
* LOG_LEVEL - (error, warn, info, verbose, debug, silly)
* MIN_MEMBER_COUNT
* MAX_MEMBER_COUNT
* TSHIRT_SIZES - (EX: S,M,L,XL)
* LOCATIONS - (EX: Columbus, Harleysville, Des Moines, Scottsdale)

### Example
```
NODE_ENV = development
HTTPS_PORT = 3443
MONGODB_URI = mongodb://localhost/Hackathon2018
LOG_LEVEL = info
SENDGRID_API_KEY = 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
MIN_MEMBER_COUNT = 3
MAX_MEMBER_COUNT = 6
TSHIRT_SIZES = XS,S,M,L,XL,XXL
LOCATIONS = Columbus, Harleysville, Des Moines, Scottsdale
```

## API Routes
* `POST/api/register-team`

**HTTP Request Body**

Property              | Type   | Description
----------------------|--------|------------
name                  | string | Team Name
appIdea               | string | Application Idea
technology            | string | Technology
platform              | string | Computing Platform (AWS, Azure, Windows, other)
picture               | file   | Team picture
members[i].first      | string | Team Member First Name
members[i].last       | string | Team Member Last Name
members[i].email      | string | Team Member Email Address  
members[i].cell       | int    | Team Member Cell Phone Number
members[i].location   | string | Team Member Location  
members[i].dept       | string | Team Member Department
members[i].manager    | string | Team Member Manager
members[i].title      | string | Team Member Job Title
members[i].tshirt     | string | Team Member T-Shirt Size
members[i].leader     | bool   | Is Team Leader
members[i].role       | string | Team Member's Role in the team
members[i].allergies  | string | Team Member Food Allergies
members[i].notes      | string | Other Notes About Team Member

  **HTTP 400 Response Body**

  Each property has a string value containing a message. In the case of members,
  empty objects will be used to represent members without any errors.

  Property               
  --------------------   
  name
  appIdea
  technology
  platform
  picture
  members[i].first
  members[i].last
  members[i].email
  members[i].cell
  members[i].location
  members[i].dept
  members[i].manager
  members[i].title
  members[i].tshirt
  members[i].leader
  members[i].role
  members[i].allergies
  members[i].notes
  otherError.memberCount
  otherError.noLeader

## Notes
- Gulp builds the `./public` directory. All files come for the `./client` directory.
