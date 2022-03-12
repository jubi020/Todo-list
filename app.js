const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

// var items = ["Buy Food", "Cook Food", "Eat Food"];
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-jubi:jubiritik@cluster0.5nuny.mongodb.net/todolistDB?retryWrites=true&w=majority");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);
const randomItem = new Item({name: "Welcome to your todo list"});
const items = [randomItem];

const listSchema = {
    name: String,
    item: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

const date = new Date();
    const options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    };
const today = date.toLocaleDateString("us-en", options);

app.get("/", (req, res) => {
    
    //date logic
    

    //database logic
    Item.find({}, (err, itemsfromdb) => {
        if(err)
        console.log(err);
        else{
            if(itemsfromdb.length === 0){
                Item.insertMany([
                    {name: "Study"},
                    {name: "Play"},
                    {name: "Sleep"}
                ], (err, res) => {
                    if(err)
                        console.log(err);
                    else
                        console.log("Successfully added the documents to the DB.");
                });
                res.redirect("/");
            }else{
                console.log("successfully retreived the data from the database");
                res.render("index", {weekDayName : today, newListItem : itemsfromdb});
            }
        }
    });
        
   

});

app.get("/:newListName", (req, res) => {
    const newListName = _.capitalize(req.params.newListName);

    List.findOne({name: newListName}, (err, result) => {
        if(err)
        console.log("An error occured which is as follows: " + err);
        else{
           if(result === null){
            console.log("creating the new list");
            const newList = new List({
                name: newListName,
                item: items
            });
           
            newList.save((err) => {
                if(err)
                    console.log("cannot save the current list");
            });

           res.redirect("/" + newListName);
           }
           else{
               console.log("List already present in the DB.");
               res.render("index", {weekDayName : newListName, newListItem : result.item})
           }
           
        }
    });
});

app.post("/", function(req, res){
    console.log("this post is working");

    var item = req.body.newItem;
    var listName = req.body.listName;

    const itemtobeinserted = new Item({name: item});

    if(listName !== today){
        List.findOne({name: listName}, (err, foundList ) => {
            if(err){
                console.log("an error occured while adding the item to the new list" + err);
            }
            else{
                foundList.item.push(itemtobeinserted);
                foundList.save();
                res.redirect("/" + listName);
            }
        });
    }
    else{
        itemtobeinserted.save();
        res.redirect("/");
    }
});

app.post("/delete", (req, res) => {
    console.log("inside the delete section");

    const listName = req.body.listName;
    const checkedItemID = req.body.checkbox;
    if(listName === today){
        Item.findByIdAndDelete(checkedItemID, (err) => {
            if(err)
                console.log("An error occured while deleting the specified item from the DB.");
            else{
                console.log("Successfully deleted the item from the database.");
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate({name: listName}, 
            {$pull: {item: {_id: checkedItemID}}}, 
            (err, foundList) => {
            res.redirect("/" + listName);
        });
    }
    
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, '0.0.0.0', () => {
    console.log("server running on port 3000 locally");
});


