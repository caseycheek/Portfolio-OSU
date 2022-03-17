--Queries for add/delete/update functionality will contain the ? character where user input is required.

--CHARACTERS PAGE
--Display all characters
SELECT charID, name, initiativeBonus, 
CASE WHEN playerCharacter = 1 THEN "Player" ELSE "Non-Player" END AS playerCharacter, 
CASE WHEN hostileToPlayer = 1 THEN "Yes" ELSE "No" END as hostileToPlayer FROM Characters

--Get all information from a selected character
SELECT charID, name, initiativeBonus, playerCharacter, hostileToPlayer, charID FROM Characters WHERE charID=?charID

--Add a new character
INSERT INTO Characters (name, initiativeBonus, playerCharacter, hostileToPlayer) VALUES (?name, ?initiativeBonus, ?playerCharacter, ?hostileToPlayer)

--Delete a character
DELETE FROM Characters WHERE charID=?charID

--Update a character
UPDATE Characters SET name=?name, initiativeBonus=?initiativeBonus, playerCharacter=?playerCharacter, hostileToPlayer=?hostileToPlayer WHERE charID=?charID


--CONDITIONS PAGE
--Display all conditions
SELECT * FROM Conditions

--Get all information from a selected condition
SELECT conID, name, effect FROM Conditions WHERE conID=?conID

--Add a new condition
INSERT INTO Conditions (name, effect) VALUES (?name, NULLIF(?effect, \'\'))

--Delete a condition
DELETE FROM Conditions WHERE conID=?conID

--Update a condition
UPDATE Conditions SET name=?name, effect=(NULLIF(?effect, \'\')) WHERE conID=?conID


--ITEMS PAGE
--Display all items
SELECT i.name AS itemName, effect, type, heldBy, quantity, 
CASE WHEN isMagic = 1 THEN "Yes" ELSE "No" END AS isMagic, itemID, c.name AS charName 
FROM Items i LEFT JOIN Characters c ON heldBy = charID

--Get information from a selected Item
SELECT name, effect, type, quantity, isMagic, itemID FROM Items WHERE itemID=?itemID

--Add an new item
INSERT INTO Items (name, effect, type, quantity, isMagic) VALUES (?name, NULLIF(?effect, \'\'), NULLIF(?type, \'\'), ?quantity, NULLIF(?isMagic, \'\'))

--Delete an item
DELETE FROM Items WHERE itemID=?itemID

--Update an item
UPDATE Items SET name=?name, type=NULLIF(?type, \'\'), quantity=?quantity, effect=NULLIF(?effect, \'\'), isMagic=NULLIF(?isMagic, \'\') WHERE itemID=?itemID


--ENCOUNTERS PAGE
--Display all encounters
SELECT * FROM Encounters

--Get all information from a selected Encounter
SELECT enID, round, setting FROM Encounters WHERE enID=?enID

--Add an new encounter
INSERT INTO Encounters (round, setting) VALUES (?round, NULLIF(?setting, \'\'))

--Delete an encounter
DELETE FROM Encounters WHERE enID=?enID

--Update an encounter
UPDATE Encounters SET round=?round, setting=NULLIF(?setting, \'\') WHERE enID=?enID


--CHARACTER DETAILS PAGE
--Displays all characters for selection from a dropdown list
SELECT charID, name FROM Characters

--Displays all conditions for the selected character
SELECT con.conID, con.name, con.effect FROM Conditions con 
INNER JOIN Conditions_Characters cc ON con.conID = cc.conID 
WHERE charID = ?charID

--Displays all items for the selected character
SELECT i.itemID, i.name, i.type, i.quantity, i.effect, 
CASE WHEN i.isMagic = 1 THEN "Yes" ELSE "No" END AS isMagic FROM Items i 
WHERE i.heldBy = ?charID

--Displays all additional conditions that could be added to the selected character
SELECT con.name, con.conID FROM Conditions con 
WHERE con.conID NOT IN 
(SELECT con.conID FROM Conditions con JOIN Conditions_Characters cc ON con.conID = cc.conID 
WHERE cc.charID = ?charID)

--Displays all additional items that could be added to the selected character
SELECT i.name, i.itemID FROM Items i WHERE i.itemID NOT IN 
(SELECT itemID FROM Items WHERE heldBy = ?charID)

--Adds a condition to a character
INSERT INTO Conditions_Characters (conID, charID) VALUES (?conID, ?charID)

--Adds an item to a character
UPDATE Items SET heldBy=NULLIF(?charID, \'\') WHERE itemID=?itemID

--Removes a condition from a character
DELETE FROM Conditions_Characters WHERE conID=?conID and charID=?charID

--Removes an item from a character
UPDATE Items SET heldBy=NULL WHERE itemID=?itemID


--TURN ORDER PAGE
--Display all enIDs in a dropdown menu
SELECT enID FROM Encounters

--Display all characters (and their conditions) involved in the selected encounter
SELECT c.charID, c.name, 
CASE WHEN c.playerCharacter = 1 THEN "Player" ELSE "Non-Player" END AS playerCharacter, 
CASE WHEN c.hostileToPlayer = 1 THEN "Yes" ELSE "No" END AS hostileToPlayer, ec.initiativeTotal, ec.enID, 
GROUP_CONCAT(DISTINCT con.name SEPARATOR ", ") conName 
FROM Characters c 
JOIN Encounters_Characters ec 
ON c.charID = ec.charID 
LEFT JOIN Conditions_Characters cc 
ON cc.charID = c.charID 
LEFT JOIN Conditions con 
ON con.conID = cc.conID 
WHERE enID = ?enID 
GROUP BY c.charID
ORDER BY ec.initiativeTotal DESC

--Display all characters that can be added to an encounter
SELECT c.name, c.charID, c.initiativeBonus FROM Characters c WHERE c.charID NOT IN 
(SELECT c.charID FROM Characters c JOIN Encounters_Characters ec ON c.charID = ec.charID 
WHERE ec.enID = ?enID)

--Add a character to an encounter
INSERT INTO Encounters_Characters (enID, charID, initiativeTotal) VALUES (?enID, ?charID, ?initiativeTotal)

--Get the initiativeBonus from a selected character to calculate initiativeTotal
SELECT initiativeBonus FROM Characters WHERE charID=?charID

--Remove a character from an encounter
DELETE FROM Encounters_Characters WHERE charID=?charID and enID=?enID
