module.exports = function () {
    var express = require('express');
    var router = express.Router();
    var mysql = require('./credentials.js');

    function getCharacterConditions(charID, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT con.conID, con.name, con.effect FROM Conditions con ' +
            'INNER JOIN Conditions_Characters cc ON con.conID = cc.conID ' +
            'WHERE charID = ?', [charID], function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(context.characterConditions = rows);
                }
            });
        });
    };

    function getCharacterItems(charID, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT i.itemID, i.name, i.type, i.quantity, i.effect, CASE WHEN i.isMagic = 1 THEN "Yes" ELSE "No" END AS isMagic FROM Items i ' +
            'WHERE i.heldBy = ?', [charID], function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(context.characterItems = rows);
                }
            });
        });
    };
    
    function getCharacters(charID, mysql, context) {
        return new Promise(function (resolve, reject){
            mysql.pool.query('SELECT charID, name FROM Characters', [charID], function (err, rows, fields){
                if (err) {
                    reject(err);
                } else {
                    resolve(context.characters = rows);
                }
            });
        });
    };

    function getSelectedCharacter(charID, mysql, context) {
        return new Promise(function (resolve, reject){
            mysql.pool.query('SELECT name FROM Characters WHERE charID=?', [charID], function (err, rows, fields){
                if (err) {
                    reject(err);
                } else {
                    resolve(context.selectedCharacter = rows);
                }
            });
        });
    };

    function getAvailableConditions(charID, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT con.name, con.conID FROM Conditions con ' +
            'WHERE con.conID NOT IN ' +
            '(SELECT con.conID FROM Conditions con JOIN Conditions_Characters cc ON con.conID = cc.conID ' +
            'WHERE cc.charID = ?)', [charID], function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(context.availableConditions = rows);
                }
            });
        });
    };

    function getAvailableItems(charID, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT i.name, i.itemID FROM Items i WHERE i.itemID NOT IN ' +
            '(SELECT itemID FROM Items WHERE heldBy = ?)', [charID], function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(context.availableItems = rows);
                }
            });
        });
    };

    function addConditionCharacter(conID, charID, mysql) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('INSERT INTO Conditions_Characters (conID, charID) VALUES (?, ?)', [conID, charID], function (err, rows, fields){
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    function addItemCharacter(itemID, charID, mysql) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('UPDATE Items SET heldBy=NULLIF(?, \'\') WHERE itemID=?', [charID, itemID], function (err, rows, fields){
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    function removeItemCharacter(itemID, mysql) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('UPDATE Items SET heldBy=NULL WHERE itemID=?', [itemID], function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }  
            });
        });
    };

    // Displays Character Details
    router.get('/', function (req, res, next) {
        var context = {};
        context.pageTitle = "Character Details";
        context.jsscripts = ["deleteConChar.js"];
        let charID = req.query.charID;
        context.charID = charID;
        getCharacterConditions(charID, mysql, context)
            .then(result => getCharacterItems(charID, mysql, context))
            .then(result => getCharacters(charID, mysql, context))
            .then(result => getSelectedCharacter(charID, mysql, context))
            .then(result => getAvailableConditions(charID, mysql, context))
            .then(result => getAvailableItems(charID, mysql, context))
            .then(result => res.render('CharacterDetails', context));
    });

    // Add Condition or Item, Remove Item route
    router.post('/', function (req, res, next) {
        if ("addCondition" in req.body) {
            addConditionCharacter([req.body.conID], [req.body.charID], mysql)
                .then(result => res.redirect('/characterdetails?charID=' + [req.body.charID]));
        } else if ("addItem" in req.body) {
            addItemCharacter([req.body.itemID], [req.body.charID], mysql)
                .then(result => res.redirect('/characterdetails?charID=' + [req.body.charID]));
        } else if ("removeItem" in req.body) {
            removeItemCharacter([req.body.itemID], mysql)
                .then(result => res.redirect('/characterdetails?charID=' + [req.body.charID]));
        }
    });

    // Remove Condition from Character route
    router.delete('/:conID&:charID', function (req, res, next) {
        mysql.pool.query('DELETE FROM Conditions_Characters WHERE conID=? and charID=?', [req.params.conID, req.params.charID], function (err, rows, fields) {
            if (err) {
                res.write(JSON.stringify(err));
                res.status(400);
                next(err);
                return;
            } else {
                res.status(202).end();
            };
        });
    });
    return router;
}();