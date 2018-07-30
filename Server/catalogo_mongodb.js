/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require("express");
var app = express();
var mongo = require("mongodb");

var server = new mongo.Server("localhost", 27017, {autoreconnect: true});
var db = new mongo.Db("auto", server);
var BSON = mongo.BSONPure;

db.open(function(err, db) {
    if (err) {
        console.log("errore db.open:" + err);
    } else {
        console.log("connesso al db auto");
    }
});

exports.findById = function (req,res) {
    var id = req.params.id;
    console.log("findById - id: " + id );   
    db.collection("auto", function(err, coll) {
        if(err) {
            console.log("errore in db.collection: " + err);
        }else{
            coll.findOne({"_id": new BSON.ObjectID(id)}, function(err,item) {
                    res.send(item);
            });
        }
    });
};

exports.findByText = function (req,res) {
    var query = req.query.q;
    console.log("q= " + query);
    db.collection("auto", function(err, coll) {
        if(!err) {
            coll.find({$or:[{"marca":{$regex: query}},{"modello":{$regex: query}}]}).toArray(function(err,items) {
                if(err) {
                    console.log("errore in coll.find: " + err);
                } else {
                    console.log("find ok");
                    res.send(items);
                }
            });
        }
    });    
};

exports.findAll = function (req,res) {
    db.collection("auto", function(err, coll) {
        if(!err) {
            coll.find().toArray(function(err,items) {
                if(!err) {   
                    res.send(items);
                }
            });
        }
    });    
};

exports.addAuto = function (req,res) {
    var auto = req.body;
    console.log(JSON.stringify(auto));
    db.collection("auto", function(err, coll) {
        if(err) {
           console.log("errore in db.collection: " + err);
        }else{
            coll.insert(auto, function(err, result) {
                if(err) {
                    console.log("errore in coll.insert: " + err);
                }else{
                     console.log('Success: ' + result);
                        res.send({"result": result});
                }
            });
        }
    });      
};

exports.update = function (req,res) {
    var id = req.params.id;
    var auto = req.body;
    console.log(JSON.stringify(auto));
    db.collection("auto", function(err, coll) {
        if(err) {
           console.log("errore in db.collection: " + err);
        }else{
            coll.update({"_id":new BSON.ObjectID(id)},auto, function(err, result) {
                if(err) {
                    console.log("errore in coll.update: " + err);
                }else{
                     console.log('Success: ' + result);
                        res.send({"result": result});
                }
            });
        }
    });      
};

exports.delete = function (req,res) {
    var id = req.params.id;
    console.log(JSON.stringify(auto));
    db.collection("auto", function(err, coll) {
        if(err) {
           console.log("errore in db.collection: " + err);
        }else{
            coll.delete({"_id":new BSON.ObjectID(id)},function(err, result) {
                if(err) {
                    console.log("errore in coll.update: " + err);
                }else{
                     console.log('Success: ' + result);
                        res.send({"result": result});
                }
            });
        }
    });      
};