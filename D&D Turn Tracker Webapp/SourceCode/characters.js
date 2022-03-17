module.exports = function () {
    var express = require('express');
    var router = express.Router();
    var mysql = require('./credentials.js');

    function getCharacters(res, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT charID, name, initiativeBonus, CASE WHEN playerCharacter = 1 THEN "Player" ELSE "Non-Player" END AS playerCharacter, CASE WHEN hostileToPlayer = 1 THEN "Yes" ELSE "No" END as hostileToPlayer FROM Characters', function (err, rows) {
                if (err) {
                    reject(error);
                } else {
                    resolve(context.characters = rows);
                }
            });
        });
    }
    function getSelectedCharacter(charID, res, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT charID, name, initiativeBonus, playerCharacter, hostileToPlayer, charID FROM Characters WHERE charID=?', [charID], function (error, rows) {
                if (error) {
                    reject(error);
                } else {
                    resolve(context.selectedCharacter = rows[0]);
                }
            });
        });
    }

    router.get('/', function (req, res, next) {
        var context = {};
        context.pageTitle = "Characters";
        context.jsscripts = ["deleteCharacter.js"];
        getCharacters(res, mysql, context).then(result => res.render('Characters', context));
    });

    // Route to add characters to the table from the form
    router.post('/', function (req, res, next) {
        mysql.pool.query('INSERT INTO Characters (name, initiativeBonus, playerCharacter, hostileToPlayer) VALUES (?,?,?,?)',
            [req.body.name, req.body.initiativeBonus, req.body.playerCharacter, req.body.hostileToPlayer], function (err, rows, fields) {
                if (err) {
                    next(err);
                    return;
                }
                res.redirect('/characters');
            });
    });

    router.get('/:id', function (req, res, next) {
        var context = {};
        context.pageTitle = "Update Character"
        //add scripts to the page header
        context.jsscripts = ["updateCharacter.js"];
        //helper function to precheck checkboxes based on boolean value form the database
        context.helpers = {
            checkedTrue: function (value) {
                if(value ==  true){
                return 'checked';
                }
            },
            checkedFalse: function (value) {
                if(value ==  false){
                return 'checked';
                }
            }
        }
        getSelectedCharacter(req.params.id, res, mysql, context)
            .then(result => res.render('Update_Character', context));
    });

    // Route to delete characters from the table
    router.delete('/:id', function (req, res, next) {
        mysql.pool.query('DELETE FROM Characters WHERE charID=?', [req.params.id], function (err, rows, fields) {
            if (err) {
                res.write(JSON.stringify(err));
                res.status(400);
                next(err);
                return;
            } else {
                res.status(202).end();
            }
        });
    });

    router.put('/:id', function (req, res, next) {
        mysql.pool.query("UPDATE Characters SET name=?, initiativeBonus=?, playerCharacter=?, hostileToPlayer=? WHERE charID=?", [req.body.name, req.body.initiativeBonus, req.body.playerCharacter, req.body.hostileToPlayer, req.params.id], function (err, rows, fields) {
            if (err) {
                res.write(JSON.stringify(err));
                res.status(400);
                next(err);
                return;
            } else {
                res.status(202).end();
            }
        });
    });
    return router;
}();