module.exports = function () {
    var express = require('express');
    var router = express.Router();
    var mysql = require('./credentials.js');

    function getTurnOrder(enID, res, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT c.charID, c.name, CASE WHEN c.playerCharacter = 1 THEN "Player" ELSE "Non-Player" END AS playerCharacter, CASE WHEN c.hostileToPlayer = 1 THEN "Yes" ELSE "No" END AS hostileToPlayer, ec.initiativeTotal, ec.enID, ' +
                'GROUP_CONCAT(DISTINCT con.name SEPARATOR ", ") conName ' +
                'FROM Characters c ' +
                'JOIN Encounters_Characters ec ' +
                'ON c.charID = ec.charID ' +
                'LEFT JOIN Conditions_Characters cc ' +
                'ON cc.charID = c.charID ' +
                'LEFT JOIN Conditions con ' +
                'ON con.conID = cc.conID ' +
                'WHERE enID = ? ' +
                'GROUP BY c.charID ' +
                'ORDER BY ec.initiativeTotal DESC', [enID], function (err, rows, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(rows);
                        resolve(context.encounter_characters = rows);
                    }
                });
        });
    };
    function getEncounters(enID, res, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT enID FROM Encounters', [enID], function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(context.encounters = rows);
                }
            });
        });
    };
    function getAvailableCharacters(enID, res, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT c.name, c.charID, c.initiativeBonus FROM Characters c WHERE c.charID NOT IN (SELECT c.charID FROM Characters c JOIN Encounters_Characters ec ON c.charID = ec.charID ' +
                'WHERE ec.enID = ?)', [enID], function (err, rows, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(context.availableCharacters = rows);
                    }
                });
        });
    };
    function addEncounterCharacter(enID, charID, intTotal, mysql) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('INSERT INTO Encounters_Characters (enID, charID, initiativeTotal) VALUES (?, ?, ?)', [enID, charID, intTotal], function (err, rows, fields) {
                if (err) {
                    reject (err);
                } else {
                    resolve();
                }
            });
        });
    };
    function getInitiativeTotal(charID, intRoll, mysql, intStats) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT initiativeBonus FROM Characters WHERE charID=?', [charID], function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(intStats.total = Number(rows[0].initiativeBonus) + Number(intRoll));
                }
            });
        });
    }

    // Displays Turn Order
    router.get('/', function (req, res, next) {
        var context = {};
        context.pageTitle = "Turn Order";
        context.jsscripts = ["deleteTurn.js"];
        let enID = req.query.enID;
        context.enID = enID;
        getTurnOrder(enID, res, mysql, context)
            .then(result => getEncounters(enID, res, mysql, context))
            .then(result => getAvailableCharacters(enID, res, mysql, context))
            .then(result => res.render('TurnOrder', context));
    });

    // Turn Order add character route
    router.post('/', function (req, res, next) {
        var intStats = {}
        getInitiativeTotal([req.body.charID], [req.body.initiativeRoll], mysql, intStats)
            .then(result => addEncounterCharacter([req.body.enID], [req.body.charID], [intStats.total], mysql))
            .then(result => res.redirect('/turnorder?enID=' + [req.body.enID]));
    });

    // Turn order remove route
    router.delete('/:charID&:enID', function (req, res, next) {
        mysql.pool.query('DELETE FROM Encounters_Characters WHERE charID=? and enID=?', [req.params.charID, req.params.enID], function (err, rows, fields) {
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