const express=require('express');
const app=express();
const port=3000;
const bodyParser=require('body-parser');
const mariadb=require('mariadb');

const urlEncodedBodyParser=bodyParser.urlencoded({extended:false});

class Customer
{
constructor(id,firstName,lastName)
{
this.id=id;
this.firstName=firstName;
this.lastName=lastName;
}

getId()
{
return this.id;
}
getFirstName()
{
return this.firstName;
}
getLastName()
{
return this.lastName;
}
}



app.use(express.static('learn'));


app.get("/",function(request,response){
response.redirect('/index.html');
})


app.get("/getFilmsByLanguage",urlEncodedBodyParser,function(request,response){
mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then(function(connection){
var languageId=parseInt(request.query.languageId);
//console.log(languageId);
connection.query(`select film_id,title from film where language_id=${languageId} order by title`).then(function(rows){
var films=[];

rows.forEach((row)=>{
films.push({"id" : row.film_id, "title" : row.title});
});
connection.end();
response.send(films);
}).catch(function(err){
console.log(err.message);
});

}).catch(function(err){
console.log(err.message);
});
});







app.get("/getLanguages",function(request,response){
mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then(function(connection){

connection.query("select language_id,name from language order by name").then(function(rows){
var languages=[];

rows.forEach((row)=>{
languages.push({"id" : row.language_id, "name" : row.name});
});

connection.end();
response.send(languages);
}).catch(function(err){
console.log(err.message);
});

}).catch(function(err){
console.log(err.message);
});
});




app.get("/getFirstNames",urlEncodedBodyParser,function(request,response){
mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then(function(connection){

var firstNamePattern=request.query.firstNamePattern;
//console.log(firstNamePattern);
connection.query(`select distinct first_name from customer where first_name like '${firstNamePattern}%' order by first_name`).then(function(rows){



var firstNames=[];
var firstName;
var i=0;

while(i<rows.length)
{
firstName=rows[i].first_name;
firstNames.push(firstName);
i++;
}


connection.end();
response.send(firstNames);
}).catch(function(err){
console.log(err.message);
response.send(err.message);
});

}).catch(function(err){
console.log(err.message);
response.send(err.message);
});

});





app.get("/getEmployees",function(request,response){
mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then(function(connection){

connection.query("select customer_id,first_name,last_name from customer order by first_name,last_name").then(function(rows){
var customers=[];
var id,firstName,lastName;
var i=0;
var customer;
while(i<rows.length)
{
id=rows[i].customer_id;
firstName=rows[i].first_name;
lastName=rows[i].last_name;
customer=new Customer(id,firstName,lastName);
customers.push(customer);
i++;
}


connection.end();
response.send(customers);
}).catch(function(err){
console.log(err.message);
response.send(err.message);
});

}).catch(function(err){
console.log(err.message);
response.send(err.message);
});

});






app.get("/employees",function(request,response){
mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"

}).then(function(connection){

connection.query("select customer_id,first_name,last_name from customer").then(function(rows){

var html="";

html=html+"<!DOCTYPE HTML>";
html=html+"<html lang='en'>";
html=html+"<head>";
html=html+"<meta charser='utf-8'>";
html=html+"<title>Video Rental Library Application</title>";
html=html+"<style>";
html=html+"table {";
html=html+"border : 1px solid black;";
html=html+"border-collapse : collapse;";
html=html+"}";
html=html+"table th,td {";
html=html+"border : 1px solid black;";
html=html+"}";
html=html+"</style>";

html=html+"</head>";
html=html+"<body>";
html=html+"<h1>Customers</h1>";
html=html+"<table>";
html=html+"<thead>";
html=html+"<tr>";
html=html+"<th>S.No.</th>";
html=html+"<th>Id.</th>";
html=html+"<th>First name</th>";
html=html+"<th>Last name</th>";
html=html+"</tr>";
html=html+"</thead>";
html=html+"<tbody>";

var i=0;
while(i<rows.length)
{
html=html+"<tr>";
html=html+"<td>";
html=html+(i+1);
html=html+"</td>";
html=html+"<td>";
html=html+rows[i].customer_id;
html=html+"</td>";
html=html+"<td>";
html=html+rows[i].first_name;
html=html+"</td>";
html=html+"<td>";
html=html+rows[i].last_name;
html=html+"</td>";
html=html+"</tr>";
i++;
}
html=html+"</tbody>";
html=html+"</table>";
html=html+"<a herf='index.html'>Home</a><br>";
html=html+"</body>";
html=html+"</html>";



connection.end();
response.send(html);

}).catch(function(err){
console.log(err);
response.send(err);
});


}).catch(function(err){
console.log(err);
response.send(err);
});
})

app.listen(port,function(error){
if(error)
{
console.log(`Some problem ${error}`);
}
console.log(`Server is ready to accept request on port ${port}`);
});