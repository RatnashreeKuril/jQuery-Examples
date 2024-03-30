const express=require('express');
const app=express();
const port=3000;
const bodyParser=require('body-parser');
const mariadb=require('mariadb');



const timePass=(ms)=>{
var promise=new Promise((resolve)=>{
setTimeout(resolve,ms);
});
return promise;
}

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


app.get("/getPlayers",function(request,response){
mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then((connection)=>{
connection.query("select * from players").then((rows)=>{
var players=[];
rows.forEach((row)=>{
players.push({"id" : row.id, "name" : row.name, "teamId" : row.team_id});
});
connection.end();
response.send(players);
}).catch((err)=>{
console.log(err.message);
});

}).catch((err)=>{
console.log(err.message);
});
});

app.get("/getTeams",function(request,response){
mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then((connection)=>{
connection.query("select * from teams").then((rows)=>{
var teams=[];
rows.forEach((row)=>{
teams.push({"id" : row.id, "name" : row.name});
});
connection.end();
response.send(teams);
}).catch((err)=>{
console.log(err.message);
});

}).catch((err)=>{
console.log(err.message);
});
});

app.post("/updateTeams",urlEncodedBodyParser,function(request,response){
var receive=request.body.receive;
var id=parseInt(request.body.id);
var receiveIn;
var teamId;
if(receive.toLowerCase()=="players") 
{
receiveIn="players";
teamId=null;
}
else 
{
receiveIn="teams";
teamId=parseInt(receive);
}
mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then(async (connection)=>{

await connection.query(`select * from players where id=${id}`).then((rows)=>{
if(rows.length==0) 
{
connection.end();
response.send({success : false, error : "Invalid id : "+id});
}

}).catch((err)=>{
console.log(err.message);
response.send({success : false, error : err.message});
});

if(receiveIn==="teams")
{
await connection.query(`select * from teams where id=${teamId}`).then((rows)=>{
if(rows.length==0) 
{
connection.end();
response.send({success : false, error : "Invalid team id : "+teamId});
}

}).catch((err)=>{
console.log(err.message);
response.send({success : false, error : err.message});
});
}

await connection.query(`update players set team_id=${teamId} where id=${id}`).then(()=>{

}).catch((err)=>{
console.log(err.message);
response.send({success : false, error : err.message});
});


connection.end();
response.send({success : true});



}).catch((err)=>{
console.log(err.message);
response.send({success : false, error : err.message});
});


});



app.post("/updateAllSubjects",urlEncodedBodyParser,function(request,response){
console.log(request.body);

var remove=request.body.remove;
var receive=request.body.receive;
var id=request.body.id;
var removeFromTable;
var receiveInTable;
var name;
if(remove.toLowerCase()==="subjects") removeFromTable="subjects";
else if(remove.toLowerCase()==="selectedsubjects") removeFromTable="selected_subjects";
else throw Error("Invalid table name : "+remove);
if(receive.toLowerCase()==="subjects") receiveInTable="subjects";
else if(receive.toLowerCase()==="selectedsubjects") receiveInTable="selected_subjects";
else throw Error("Invalid table name : "+receive);

if(id<=0) throw Error(`Invalid id : ${id}`);

mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then(async (connection)=>{

await connection.query(`select * from ${removeFromTable} where id=${id}`).then((rows)=>{
if(rows.length==0) throw Error(`Invalid id : ${id}`);
name=rows[0].name;
}).catch((err)=>{
console.log(err.message);
response.send({success : false, error : err.message});
});
console.log(`delete from ${removeFromTable} where id=${id}`);
console.log(`insert into ${receiveInTable} values(${id},'${name}')`);

await connection.query(`delete from ${removeFromTable} where id=${id}`).then(()=>{
console.log("deleted");
}).catch((err)=>{
console.log(err.message);
response.send({success : false, error : err.message});
});

await connection.query(`insert into ${receiveInTable} values(${id},'${name}')`).then(()=>{
console.log("inserted");
}).catch((err)=>{
console.log(err.message);
response.send({success : false, error : err.message});
});

connection.end();
response.send({success : true});


}).catch((err)=>{
console.log(err.message);
response.send({success : false, error : err.message});
});

});


app.get("/getAllSubjects",function(request,response){
mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then(async function(connection){

obj={
subjects : [],
selectedSubjects : []
};

await connection.query("select * from subjects order by id").then((rows)=>{
var subjects=[];
rows.forEach((row)=>{
subjects.push({id : row.id, name : row.name});
});

console.log(subjects);
obj.subjects=subjects;
console.log(obj);
}).catch((err)=>{
console.log(err.message);
});

console.log("000000000000000"+obj);
await connection.query("select * from selected_subjects order by id").then((rows)=>{
var selectedSubjects=[];
rows.forEach((row)=>{
selectedSubjects.push({id : row.id, name : row.name});
});

obj.selectedSubjects=selectedSubjects;
}).catch((err)=>{
console.log(err.message);
});

console.log("111111111111"+obj);
connection.end();
response.send(obj);


}).catch(function(err){
console.log(err.message);
});

});


app.post("/updateCities",urlEncodedBodyParser,function(request,response){
mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then((connection)=>{

var sno=parseInt(request.body.sno);
var name=request.body.name;
connection.query(`select sno from cities where name='${name}'`).then((rows)=>{
if(rows.length==0)
{
connection.end();
response.send({success : false, error : name+" does not exists"});
}
}).catch((err)=>{
console.log(err.message);
});

connection.query(`update cities set sno=${sno} where name='${name}'`).then(()=>{
connection.end();
response.send({success : true});
}).catch((err)=>{
console.log(err.message);
});

}).catch((err)=>{
console.log(err.message);
});

});

app.get("/getCities",function(request,response){
mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then((connection)=>{
connection.query("select * from cities order by sno").then((rows)=>{
var cities=[];
rows.forEach((row)=>{
cities.push({"sno" : row.sno, "name" : row.name});
});
connection.end();
response.send(cities);
}).catch((err)=>{
console.log(err.message);
});
}).catch((err)=>{
console.log(err.message);
});
});


app.get("/getFilmDetails",urlEncodedBodyParser,async function(request,response){
await timePass(6000);
var filmId=parseInt(request.query.filmId);

mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then(function(connection){

console.log(filmId);

connection.query(`select film_id,title,description,language_id,release_year,length from film where film_id=${filmId}`).then(async function(rows){
if(rows.length==0)
{
await connection.end();
response.send({filmId : filmId, title : "", description : "", languageId : 0, releaseYear : "", length : 0});
return;
}
var film;
rows.forEach((row)=>{
film={id : row.film_id, title : row.title, description : row.description, language : row.language, releaseYear : row.release_year, length : row.length}
});
connection.end();
response.send(film);
}).catch(function(err){
console.log(err.message);
});





}).catch(function(err){
console.log(err.message);
});
});







app.get("/getFilmsByLanguage",urlEncodedBodyParser,async function(request,response){
await timePass(6000);

mariadb.createConnection({
"user" : "root",
"password" : "kuril",
"host" : "localhost",
"port" : 5506,
"database" : "sakila"
}).then(function(connection){
var languageId=parseInt(request.query.languageId);
//console.log(languageId);
connection.query(`select film_id,title from film where language_id=${languageId} order by title`).then(async function(rows){
if(rows.length==0)
{
await connection.end();
response.send([]);
return;
}
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