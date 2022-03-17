module.exports = function () {
    var express = require('express');
    var router = express.Router();
    var mysql = require('./credentials.js');

    function getConditions(res, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT * FROM Conditions', function (err, rows) {
                if (err) {
                    reject(error);
                } else {
                    resolve(context.conditions = rows);
                }
            });
        });
    }

    function getSelectedCondition(conID, res, mysql, context) {
        return new Promise(function(resolve, reject) {
            mysql.pool.query('SELECT conID, name, effect FROM Conditions WHERE conID=?', [conID], function (error, rows) {
                if (error) {
                    reject(error);
                } else {
                    resolve(context.selectedCondition = rows[0]);
                }
            });
        });
    }

    router.get('/', function (req, res, next) {
        var context = {};
        context.pageTitle = "Conditions";
        context.jsscripts = ["deleteCondition.js"];
        getConditions(res, mysql, context).then(result => res.render('Conditions', context));
    });

    router.get('/:id', function (req, res, next) {
        var context = {};
        context.pageTitle = "Update Condition";
        //add scripts to the page header
        context.jsscripts = ["updateCondition.js"];
        getSelectedCondition(req.params.id, res, mysql, context)
            .then(result => res.render('Update_Condition', context));
    });

    // Route to add condition to the table from the form
    router.post('/', function (req, res, next) {
        mysql.pool.query('INSERT INTO Conditions (name, effect) VALUES (?, NULLIF(?, \'\'))', [req.body.name, req.body.effect], function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/conditions');
        });
    });
    // Route to delete condition from the table
    router.delete('/:id', function (req, res, next) {
        mysql.pool.query('DELETE FROM Conditions WHERE conID=?', [req.params.id], function (err, rows, fields) {
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
    // Route to update condition from the table
    router.put('/:id', function (req, res, next) {
        mysql.pool.query("UPDATE Conditions SET name=?, effect=(NULLIF(?, \'\')) WHERE conID=?", [req.body.name, req.body.effect, req.params.id], function (err, rows, fields){
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
