var express=require("express");
var bodyParser=require("body-parser");
var app=express();
var methodOverride=require("method-override");
var mongoose=require("mongoose");
//The basic use of this function is that it prevents user to add harmful html
var expressSanitizer=require("express-sanitizer");

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/Blog");
app.use(methodOverride("_method"));

var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title:"Sunset",
// 	image:"https://images.unsplash.com/photo-1506266851212-011fb4abc0e5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=92d5776b53b692837d82e0359c691267&auto=format&fit=crop&w=1960&q=80",
// 	body:"This is a sunset"
// },function(err,cat){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log(cat);
// 	}
// });

app.get("/",function(req,res){
	res.redirect("/blogs");
});

//Index ROUTE
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("ERROR");
		}
		else{
			res.render("index",{blogs:blogs})
		}
	});
});
//new
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//Create
app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

//Show a particular entity
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		// if(err)
		// {
		// 	console.log(err);
		// }
		// else
		// {
			res.render("show",{blog:foundBlog});
		// }
	});
});
//Edit a dog
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if (err) {
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog:foundBlog});
		}
	});
});

//UPDATE Route
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//This is just a delete req
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	})
})

app.listen(3000);