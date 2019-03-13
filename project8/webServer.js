"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var fs = require("fs");
var async = require('async');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
mongoose.Promise = require('bluebird');

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

mongoose.connect('mongodb://localhost/cs142project6', { useMongoClient: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));
            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    if (!request.session.user) {
        response.status(401).send('Nobody currently logged in');
        return;
    }

    User.find({}, function (err, users) {
        if (err) {
            console.log('Doing /user/list error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (users.length === 0) {
            console.log('Missing User');
            response.status(400).send('Missing User');
            return;
        }
        users = users.map(function(user) {
            user = JSON.parse(JSON.stringify(user));
            delete user.location;
            delete user.description;
            delete user.occupation;
            delete user.login_name;
            delete user.__v;
            delete user.password;
            delete user.favorites;
            return user;
        });
        response.status(200).send(users);
    });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    if (!request.session.user) {
        response.status(401).send('Nobody currently logged in');
        return;
    }

    var id = request.params.id;
    User.findById(id, function (err, user) {
        if (err) {
            console.log('Doing /user/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user === null) {
            console.log('User with _id: ' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        user = JSON.parse(JSON.stringify(user));
        delete user.login_name;
        delete user.__v;
        delete user.password;
        delete user.favorites;
        response.status(200).send(user);
    });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    if (!request.session.user) {
        response.status(401).send('Nobody currently logged in');
        return;
    }

    var id = request.params.id;
    Photo.find({ user_id: id }, async function (err, photos) {
        if (err) {
            console.log('Doing /photosOfUser/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (photos.length === 0) {
            console.log('Photos for user with _id: ' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }

        const photosArray = photos.map(async function (photo) {
            photo = JSON.parse(JSON.stringify(photo));
            const commentsArray = photo.comments.map(async function (comment) {
                comment = JSON.parse(JSON.stringify(comment));
                await User.findById(comment.user_id, function (err, user) {
                    if (err) {
                        console.log('Doing /photosOfUser/:id search comments error:', err);
                        response.status(400).send(JSON.stringify(err));
                    }
                    if (user === null) {
                        console.log('User with _id: ' + comment.user_id + ' not found.');
                        response.status(400).send('Not found');
                    }
                    user = JSON.parse(JSON.stringify(user));
                    delete user.location;
                    delete user.description;
                    delete user.occupation;
                    delete user.login_name;
                    delete user.__v;
                    delete user.password;
                    delete user.favorites;
                    comment.user = user;
                });

                delete comment.user_id;
                return comment;
            });

            photo.comments = await Promise.all(commentsArray);
            delete photo.__v;
            return photo;
        });

        photos = await Promise.all(photosArray);
        response.status(200).send(photos);
    });
});

/*
 * URL /admin/login - Return user object 
 */
app.post('/admin/login', function (request, response) {
    var loginName = request.body.login_name;
    var password = request.body.password;
    User.findOne({login_name: loginName, password: password}, function (err, user) {
        if (err) {
            console.log('Doing /admin/login error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user === null) {
            console.log('User with login_name: ' + loginName + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        user = JSON.parse(JSON.stringify(user));
        delete user.location;
        delete user.description;
        delete user.occupation;
        delete user.__v;
        delete user.password;
        request.session.user = user;
        response.status(200).send(user);
    });
});

/*
 * URL /admin/logout - Return success string 
 */
app.post('/admin/logout', function (request, response) {
    if (request.session.user) {
        request.session.user = null;
        response.status(200).send('Success');
    } else {
        response.status(400).send('Nobody currently logged in');
    }
});

/*
 * URL /commentsOfPhoto/:photo_id - Return comment object
 */
app.post('/commentsOfPhoto/:photo_id', function (request, response) {
    var photo_id = request.params.photo_id;

    if (!request.body.comment) {
        console.log('Doing /commentsOfPhoto/' + photo_id + ' error: empty comment');
        response.status(400).send('Comment needs to be nonempty');
        return;
    }

    var newComment = { 
        comment: request.body.comment,
        date_time: new Date(),
        user_id: request.session.user._id,
    };

    Photo.findByIdAndUpdate(photo_id, {$push: { comments: newComment }}, function(err, result) {
        if (err) {
            console.log('Doing /commentsOfPhoto/' + photo_id + ' error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        newComment.user = request.session.user;
        response.status(200).send(newComment);
    });
});

/*
 * URL /photos/new - Return success/error uploading new photo
 */
app.post('/photos/new', function (request, response) {
    processFormBody(request, response, function (err) {
        if (err || !request.file) {
            console.log('Doing /photos/new error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }

        var timestamp = new Date();
        var filename = 'U' +  String(timestamp.valueOf()) + request.file.originalname;
    
        fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
            Photo.create({
                file_name: filename,
                date_time: timestamp, 
                user_id: request.session.user._id,
                comments: [],
            }, function (err, photo) {
                if (err) {
                    console.log('Doing /photos/new error: ', err);
                    response.status(400).send(JSON.stringify(err));
                    return;
                }
                response.status(200).send("worked");
            });
        });
    });
});

/*
 * URL /user - Return success/error registering new user 
 */
app.post('/user', function (request, response) {
    var newUser = request.body;
    User.findOne({login_name: newUser.login_name}, function (err, user) {
        if (err) {
            console.log('Doing /admin/login error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user) {
            console.log('User already exists');
            response.status(400).send('User already exists');
            return; 
        }
        User.create(newUser, function (err, user) {
            if (err) {
                console.log('Doing /user error: ', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            response.status(200).send('success');
        });
    });
});

/*
 * URL /favorites - Return success/error adding favorite photo
 */
app.post('/favorites', function (request, response) {
    var photoID = request.body.photoID;
    User.findByIdAndUpdate(request.session.user._id, {$addToSet: { favorites: photoID }}, function (err, user) {
        if (err) {
            console.log('Doing /favorites error: ', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user.favorites.includes(photoID)) {
            response.status(400).send('Already favorited');
        } else {
            request.session.user.favorites.push(photoID);
            response.status(200).send('Added to favorites');
        }
    });
});

/*
 * URL /favorites - Return list of favorite photos
 */
app.get('/favorites', async function (request, response) {
    let favorites_ids = request.session.user.favorites;
    let favorites = [];
    for (let i = 0; i < favorites_ids.length; i++) {
        await Photo.findById(favorites_ids[i], function (err, photo) {
            if (err) {
                console.log('Doing /favorites error: ', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            photo = JSON.parse(JSON.stringify(photo));
            delete photo.__v;
            delete photo.user_id;
            delete photo.comments;
            favorites.push(photo);
        });
    }
    response.status(200).send(favorites);
});

/*
 * URL /favorites/delete - Return success if deleted
 */
app.post('/favorites/delete', function (request, response) {
    let photoID = request.body.photoID;
    User.findByIdAndUpdate(request.session.user._id, {$pull: { favorites: photoID }}, function (err, user) {
        if (err) {
            console.log('Doing /favorites/delete error: ', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user.favorites.includes(photoID)) {
            request.session.user.favorites = user.favorites.filter(id => id !== photoID);
            response.status(200).send('Removed from favorites');
        } else {
            response.status(400).send('Photo is not favorited');
        }
    });
});

/*
 *  URL /like - Return success if liked/unliked
 */
app.post('/like', function (request, response) {
    let photoID = request.body.photoID;
    let alreadyLiked = request.body.alreadyLiked;
    let operation = alreadyLiked ? {$pull: { likes: request.session.user._id}} : {$addToSet: { likes: request.session.user._id }};
    Photo.findByIdAndUpdate(photoID, operation, function (err, photo) {
        if (err) {
            console.log('Doing /like error: ', err); 
            response.status(400).send(JSON.stringify(err));
            return;
        }
        console.log(photo.likes);
        response.status(200).send('Switched like status');
    });
});

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});