const express=require('express');
const app=express();
const port=3000;

app.get("/",function(request,response){
response.send("Thinking machines in action for campus placements/internships");
});
app.listen(port,function(error){
if(error)
{
console.log(`Some problem ${error}`);
}
console.log(`Server is ready to accept request on port ${port}`);
});