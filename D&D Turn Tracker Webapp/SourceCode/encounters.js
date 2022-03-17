module.exports = function () {
    var express = require('express');
    var router = express.Router();
    var mysql = require('./credentials.js');

    function getEncounters(res, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT * FROM Encounters', function (err, rows) {
                if (err) {
                    reject(error);
                } else {
                    resolve(context.encounters = rows);
                }
            });
        });
    }
    function getSelectedEncounter(enID, res, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT enID, round, setting FROM Encounters WHERE enID=?', [enID], function (error, rows) {
                if (error) {
                    reject(error);
                } else {
                    resolve(context.selectedEncounter = rows[0]);
                }
            });
        });
    }
    router.get('/', function (req, res, next) {
        var context = {};
        context.pageTitle = "Encounters"
        context.jsscripts = ["deleteEncounter.js"];
        getEncounters(res, mysql, context).then(result => res.render('Encounters', context));
    });
    
    router.get('/:id', function (req, res, next) {
        var context = {};
        context.pageTitle = "Update Encounter";
        //add scripts to the page header
        context.jsscripts = ["updateEncounter.js"];
        //helper function to precheck checkboxes based on boolean value form the database
        getSelectedEncounter(req.params.id, res, mysql, context)
            .then(result => res.render('Update_Encounter', context));
    });

    // Route to add encounters to the table from the form
    router.post('/', function (req, res, next) {
        mysql.pool.query('INSERT INTO Encounters (round, setting) VALUES (?, NULLIF(?, \'\'))', [req.body.round, req.body.setting], function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/encounters');
        });
    });
    // Route to delete encounter from the table
    router.delete('/:id', function (req, res, next) {
        mysql.pool.query('DELETE FROM Encounters WHERE enID=?', [req.params.id], function (err, rows, fields) {
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
        mysql.pool.query("UPDATE Encounters SET round=?, setting=NULLIF(?, \'\') WHERE enID=?", [req.body.round, req.body.setting, req.params.id], function (err, rows, fields) {
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