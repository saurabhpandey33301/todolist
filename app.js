const express = require("express");
const {write} = require("fs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//mongodb work ....

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema ={
   name: String,
}
const item = mongoose.model("item",itemsSchema);

const item1 = new item ({
   name: "welcome to todolist"
});
const item2 = new item({
   name:"hello everynian"
})
const defaultItems = [item1,item2];

const listSchema = {
   name: String,
   items : [itemsSchema]
}
const List = mongoose.model("List",listSchema);
//mongod line code ends here.....

app.get("/", function(req,res){
   
   // var today = new Date();
   // var options = {
   //    weekday : "long" ,
   //    day : "numeric" , 
   //    month : "long"

   // };
   // var day = today.toLocaleDateString("hi-IN",options);
   
item.find({}).then(foundItems => {
      
   if(foundItems.length === 0){
      item.insertMany(defaultItems)
      .then(function () {
        console.log("Successfully saved defult items to DB");
      })
      .catch(function (err) {
        console.log(err);
      });
      res.redirect("/");
   }else{
      res.render("list",{kindOfDay:"Today",newListItems:foundItems});
   }
})
  .catch(err => {
      console.log(err);
});
});
app.get("/:customListName",function(req,res){
   //console.log(req.params.customListName);

   const customListName = req.params.customListName;
   List.findOne({name:customListName})
   .then((foundList) => {
      if (!foundList) {
        console.log("List doesn't exist");
      } else {
        console.log('List exists');
      }
    })
    .catch((err) => {
      console.log(err);
    });
   const list = new List({
      name:customListName,
      items: defaultItems
   });
   list.save();

});


app.post("/", function(req,res){
   const itemName = req.body.newItem;
   const itm = new item({
        name:itemName
   })
   itm.save();
   res.redirect("/");
})

app.post("/delete",function(req,res){
   const checkedItemId = req.body.checkBox;
   item.findByIdAndRemove(checkedItemId).then(function () {
      console.log("Successfully deleted");
      res.redirect("/")
    })
    .catch(function (err) {
      console.log(err);
    });

})
app.listen(3000 , function(req,res){
    console.log("server running at port 3000");
});