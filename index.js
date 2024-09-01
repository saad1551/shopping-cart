const express = require('express');

const mysql = require('mysql2');

const body_parser = require('body-parser');

const session = require('express-session');

const app = express();

app.use(body_parser.urlencoded({extended: false}));

app.use(body_parser.json());

app.use(express.static('public'));

app.set('view engine', 'ejs');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'shopping-cart',
    user: 'root', 
    password: 'BabarAzam989Supremacy'
});

connection.connect((error) => {
    console.log('MySQL Database is connected succesfully');
});

app.use(session({
    secret: '1234567890abcdefgh',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.get("/", (request, response) => {
    const query = `SELECT * FROM product;`;


    connection.query(query, (error, result) => {
        if (!request.session.cart) {
            request.session.cart = [];
        }

        response.render('product', {products: result, cart: request.session.cart});
    })
});


app.post("/add_cart", (request, response) => {
    const product_id = request.body.product_id;
    const product_name = request.body.product_name;
    const product_price = request.body.product_price;

    let count = 0;

    for (let i = 0; i < request.session.cart.length; i++) {
        if (request.session.cart[i].product_id === product_id) {
            request.session.cart[i].quantity += 1;
            count++;
        }
    }

    if (count == 0) {
        const cart_data = {
            product_id : product_id,
            product_name : product_name,
            product_price: parseFloat(product_price),
            quantity: 1
        };

        request.session.cart.push(cart_data);
    }

    response.redirect("/");
});

app.get("/remove_item", (request, response) => {
    const product_id = request.query.id;

    for (let i = 0; i < request.session.cart.length; i++) {
        if (request.session.cart[i].product_id === product_id) {
            request.session.cart.splice(i, 1);
        }
    }

    response.redirect("/");
});

app.listen(3000, () => {
    console.log(`Server has started on port number 3000`);
});

