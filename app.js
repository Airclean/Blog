var bodyparser = require("body-parser"),
    methodOverride = require("method-override"),
    sanitizer = require("express-sanitizer"),
    express = require("express"),
    mongoose = require("mongoose"),
    app = express();
//APP CONFIG
mongoose.connect('mongodb://localhost:27017/Blog', { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(sanitizer());

//MONGOOSE CONFIG
var Blog = require("./models/blog");
var Note = require("./models/note");
var User = require("./models/user");
User.findOne({ name: "Jinyu Chen" }).populate("posts").exec(function(err, user) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(user);
    }
});

Blog.find({}, function(err, blogs) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(blogs);
    }
});

Note.find({}, function(err, notes) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(notes);
    }
})
//RESTFUL ROUTES
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log("ERROR");
        }
        else {
            res.render("index", { blogs: blogs });
        }
    })
});
app.get("/blogs/notes", function(req, res) {
    Note.find({}, function(err, notes) {
        if (err) {
            console.log("ERROR");
        }
        else {
            res.render("index_notes", { notes: notes });
        }
    })
});

app.post("/blogs/notes", function(req, res) {
    Note.create(req.body.Note, function(err, note) {
        if (err) {
            res.redirect("/blogs/notes/new");
        }
        else {
            res.redirect("/blogs/notes");
        }
    })
});

app.get("/blogs/notes/:id/edit", function(req, res) {
    Note.findById(req.params.id, function(err, note) {
        if (err) {
            res.redirect("/blogs/notes/" + req.params.id);
        }
        else {
            res.render("edit_note", { note: note });
        }
    })
});

app.put("/blogs/notes/:id", function(req, res) {
    Note.findByIdAndUpdate(req.params.id, req.body.Note, function(err, updatedNote) {
        if (err) {
            res.redirect("/blogs/notes/" + req.params.id + "/edit");
        }
        else {
            res.redirect("/blogs/notes/" + req.params.id);
        }
    })
})

app.get("/blogs/notes/new", function(req, res) {
    res.render("new_notes");
})

app.get("/blogs/notes/:id", function(req, res) {
    Note.findById(req.params.id, function(err, note) {
        if (err) {
            res.redirect("/blogs/notes");
        }
        else {
            res.render("show_note", { note: note });
        }
    })
});

app.delete("/blogs/notes/:id", function(req, res) {
    Note.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/blogs/notes");
        }
        else {
            res.redirect("/blogs/notes");
        }
    })
});

app.get("/blogs/new", function(req, res) {
    res.render("new");
});

app.post("/blogs", function(req, res) {
    Blog.create(req.body.Blog, function(err, blog) {
        if (err) {
            res.redirect("/blogs/new");
        }
        else {
            res.redirect("/blogs");
        }
    })
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("show", { blog: blog });
        }
    })
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            res.render("/blogs/" + req.params.id);
        }
        else {
            res.render("edit", { blog: blog });
        }
    })
});

app.put("/blogs/:id", function(req, res) {
    req.body.Blog.body = req.sanitize(req.body.Blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.Blog, function(err, updatedblog) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err)
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs");
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server Started");
});
