const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config()
const app = express();

// using body parser
app.use(bodyParser.urlencoded({ extended: true }));

//using ejs
app.set('view engine', 'ejs');

//serving static files
app.use(express.static(__dirname+'/public'))

//connecting to mongodb database
mongoose.connect(process.env.databaseURI,{ useNewUrlParser: true });

//blogschema
const blogSchema = mongoose.Schema({
  blogTitle:{
    type:String,
    required:[true,"where is the blog title?"]
  },
  blogPost:{
    type:String,
    required:[true,"where is the blog content?"]
  }
});

//blog model
const Blog = mongoose.model("blogpost",blogSchema);





app.get("/",(req,res)=>{
  Blog.find({},(err,foundposts)=>{
    if(err){
      console.log(err);
    }else{
      res.render("home",{data:foundposts});
    }
  });

});

app.get("/:routeOption",(req,res)=>{
  option = req.params.routeOption;
  if(option === "deletepost" || option === "delete-post"){

    Blog.find({},(err,foundposts)=>{
      if(err){
        console.log(err);
      }else{
        res.render("delete",{data:foundposts});
      }
    });

  }else if(option === "makepost" || option === "make-post" ){
    res.render("compose");

  }else if(option === "about"){
    res.render("about");
  }else{
    Blog.findById(option,(err,foundpost)=> {
      if(err){
        console.log(err);
        res.redirect("/");
      }else{
        res.render("post",{post:foundpost});
      }

    });
  }

});




app.post("/",(req,res)=>{
  const postTitle = req.body.postTitle;
  const postContent= req.body.postContent;
  const blogPost = new Blog({
    blogTitle:postTitle,
    blogPost:postContent
  });

  if(postTitle.length > 0 && postContent.length>0){
    blogPost.save((err)=>{
      if(!err){
        console.log("documents successfully added to database");
        res.redirect("/");
      }
    });
  }else{
    res.redirect("makepost")
  }


});


app.post("/delete",(req,res)=>{
  const deleteID = req.body.deleteID;
  Blog.findByIdAndDelete(deleteID,(err)=>{
    if(!err){
      console.log("document successfully deleted from database.");
      res.redirect("/");
    }

  });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,(req,res)=>{
  console.log(`server started at port ${port}`);
});
