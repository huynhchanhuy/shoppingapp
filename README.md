# Basic Shopping Cart App

This app is designed to assess my skills as a back-end NodeJS developer.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### API References
* I did include **ShoppingApp.postman_collection.json** file in the source code. You just need to import this file to Postman to get **endpoint list**. Or you can click to this [export link](https://www.getpostman.com/collections/76f6f28e8691af667084) to get the API Collection.

* Here is [API Documentation](https://shoppingapp2.docs.apiary.io/). You can run it on-the-fly.

### API Gateway Server for Deployment.
* On [Heroku App](https://leflair-shopping-app.herokuapp.com/).

### Prerequisites
* [ExpressJS](https://github.com/expressjs/express/):  is fast and simple framework for Node for handling RESTFul API request with the better performance. Provided a lot of libraries and helpers that easy to use.

* [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://github.com/Automattic/mongoose) framework): stores data in JSON-like documents that can vary in structure. represent hierarchical relationships, to store arrays, and other more complex structures easily. Query data a lot of faster than Relational Database like MySQL. 

* [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai): tools for doing unit-testing for NodeJS.

* [Nodemailer](https://github.com/nodemailer/nodemailer): Easily to config and send email with NodeJS.

* [HBS](https://github.com/pillarjs/hbs): a view engine for ExpressJS, I will use it to create email template.

* [Postman](https://www.getpostman.com/): an API Testing Tool with powerful GUI that we can use to validate our endpoint quickly.

* [Heroku](https://www.heroku.com/): a Cloud Application Platform, I use it for deploy my project. Reason is simple, it has a free plan for study and testing. Fast and easy to deploy to the cloud.

### Directory Structure
    
```
-- core
---- config.js
---- db.js
---- session.js
-- models
---- cart.js
---- order.js
---- product.js
-- routes
---- cart
------ clear.js
------ delete.js
------ edit.js
------ insert.js
---- product
------ detail.js
------ list.js
------ search.js
---- checkout.js
---- index.js
-- seed
---- product_seeder.js
-- test
---- routes.cart.delete.js
---- routes.cart.edit.js
---- routes.cart.empty_session.js
---- routes.cart.product.js
-- view
---- emails
------ order-confirmation.hbs
app.js
dev.json
test.json
package.json
```

### Features
#### API
```
<host_name>/resource_name/<id_or_keyword>?param1=value1
```
#### Product
 * You can can see product schema inside folder *models/product.js* .
 * You can:
    * View product list:
        * use param *_select* to select exactly field name that matched with the list you given. For example: *_select=name,price,shortDescription,availability,img.main*
        * use param *_limit* to limit a certain number of results to be returned.
        * use param *_skip* that return a certain number of results after a certain number of documents.
        * use param *availability* (true or false) to return any records that available to be added to cart. 
    * Search products by giving keyword and setting your fields you want to query on. You can use the same params that given in *View List Product*.
    * View detail product by giving the *product_id*. You can use the same params (except availability, *_limit* and *_skip*) that stated above.
#### Cart
 * I use session to stored the cart. That session will be stored in MongoDB and it has the expired time is 3 hours.
 * You can:
    * Add to cart.
    * Remove a product from the cart.
    * Remove all products from the cart.
    * Edit the quantity of a item inside the cart.
#### Checkout
 * Checkout the cart and remove all items inside the cart. Make an order and send a email.

### Installing

Install NodeJs and NPM

```
https://nodejs.org/en/download/
```
To seeding our product data model, do as follow
```
$ node seed/product_seeder.js
```
It will insert new product records to DB.

At the node's root project, run the command

```
$ npm install
```
to install all package inside *package.json*

## Deployment and Testing
#### localhost
Run this command at root folder
```
$ npm start
```
So, the server will listen on port 3000. You can access API via
```
https://localhost:3000
```

#### Heroku
I did setup the demo on Heroku.
```
https://leflair-shopping-app.herokuapp.com/
```

#### MongoDB Server
I'm using free DB from [MLab](https://mlab.com/) - a strong Database-as-a-Service for MongoDB.

## Running the tests
I create two json file, one is **dev.json** for development environment, the other is **test.json** for the test environment.

```
$ npm test
```

## Authors

* **Huy Huynh Chan** - Backend Software Developer