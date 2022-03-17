module.exports = function () {
    var express = require('express');
    var router = express.Router();
    var mysql = require('./credentials.js');

    function getItems(res, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT i.name AS itemName, effect, type, heldBy, quantity, CASE WHEN isMagic = 1 THEN "Yes" ELSE "No" END AS isMagic, itemID, c.name AS charName FROM Items i LEFT JOIN Characters c ON heldBy = charID', function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(context.items = rows);
                }
            });
        });
    }
    function getSelectedItem(itemID, res, mysql, context) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query('SELECT name, effect, type, quantity, isMagic, itemID FROM Items WHERE itemID=?', [itemID], function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(context.selectedItem = rows[0]);
                }
            });
        });
    }
    router.get('/', function (req, res, next) {
        var context = {};
        context.pageTitle = "Items";
        //add scripts to the page header
        context.jsscripts = ["deleteItem.js"];
        getItems(res, mysql, context).then(result => res.render('Items', context));
    });

    router.get('/:id', function (req, res, next) {
        var context = {};
        context.pageTitle = "Update Item"
        //add scripts to the page header
        context.jsscripts = ["updateItem.js"];
        //helper function to precheck checkboxes based on boolean value form the database
        context.helpers = {
            checked: function (value) {
                if(value ==  true){
                return 'checked';
                }
            }
        }
        getSelectedItem(req.params.id, res, mysql, context)
            .then(result => res.render('Update_Item', context));
    });

    // Route to add items to the table from the form
    router.post('/', function (req, res, next) {
        mysql.pool.query('INSERT INTO Items (name, effect, type, quantity, isMagic) VALUES (?, NULLIF(?, \'\'), NULLIF(?, \'\'), ?, NULLIF(?, \'\'))', [req.body.name, req.body.effect, req.body.type, req.body.quantity, req.body.isMagic], function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/items');
        });
    });
    // Route to delete item from the table
    router.delete('/:id', function (req, res, next) {
        mysql.pool.query('DELETE FROM Items WHERE itemID=?', [req.params.id], function (err, rows, fields) {
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

    //Route for updating item
    router.put('/:id', function (req, res, next) {
        mysql.pool.query("UPDATE Items SET name=?, type=NULLIF(?, \'\'), quantity=?, effect=NULLIF(?, \'\'), isMagic=NULLIF(?, \'\') WHERE itemID=?", [req.body.name, req.body.type, req.body.quantity, req.body.effect, req.body.isMagic, req.params.id], function (err, rows, fields) {
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