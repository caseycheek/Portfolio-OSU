SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Characters;
CREATE TABLE Characters(
    charID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    initiativeBonus INT NOT NULL,
    playerCharacter TINYINT(1) NOT NULL,
    hostileToPlayer TINYINT(1) NOT NULL
);
INSERT INTO Characters(
        name,
        initiativeBonus,
        playerCharacter,
        hostileToPlayer
    )
VALUES ('Pip', 2, 1, 0),
    ('Pop', 3, 1, 0),
    ('Pap', 5, 0, 1);
DROP TABLE IF EXISTS Encounters;
CREATE TABLE IF NOT EXISTS Encounters(
    enID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    round INT NOT NULL DEFAULT 1,
    setting VARCHAR(255)
);
INSERT INTO Encounters(round, setting)
VALUES (1, 'Forest'),
    (4, 'Caves'),
    (2, 'Castle');
DROP TABLE IF EXISTS Items;
CREATE TABLE Items(
    itemID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    heldBy INT,
    type VARCHAR(255),
    quantity INT NOT NULL DEFAULT 1,
    effect VARCHAR(255),
    isMagic TINYINT(1) DEFAULT 0,
    CONSTRAINT FK_CharIDHeldBy FOREIGN KEY (heldBy) REFERENCES Characters (charID) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Items(heldBy, name, type, quantity, effect, isMagic)
VALUES(1, 'Sting', 'Spear', 1, 'Long Reach', true),
    (
        2,
        'Excalibur',
        'Swords',
        2,
        '1d8 Slashing',
        false
    ),
    (
        1,
        'Ring of Spell Storing',
        'Ring',
        1,
        'Store a spell in the ring',
        true
    );
DROP TABLE IF EXISTS Conditions;
CREATE TABLE Conditions(
    conID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    effect VARCHAR(225)
);
INSERT INTO Conditions(name, effect)
VALUES (
        'Blinded',
        'Attack Rolls against the creature have advantage, and the creature’s Attack Rolls have disadvantage.'
    ),
    (
        'Incapacitated',
        'An incapacitated creature can’t take Actions or Reactions.'
    ),
    (
        'Poisoned',
        'A poisoned creature has disadvantage on Attack Rolls and Ability Checks.'
    );
DROP TABLE IF EXISTS Encounters_Characters;
CREATE TABLE Encounters_Characters(
    enID INT NOT NULL,
    charID INT NOT NULL,
    initiativeTotal INT,
    PRIMARY KEY (enID, charID),
    CONSTRAINT FK_EC_charIDcharID FOREIGN KEY (charID) REFERENCES Characters (charID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_enIDenID FOREIGN KEY (enID) REFERENCES Encounters (enID) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Encounters_Characters(enID, charID, initiativeTotal)
VALUES (1, 2, 13),
    (2, 1, 8),
    (3, 1, 25),
    (1, 1, 15),
    (1, 3, 7);
DROP TABLE IF EXISTS Conditions_Characters;
CREATE TABLE Conditions_Characters(
    conID INT NOT NULL,
    charID INT NOT NULL,
    PRIMARY KEY (conID, charID),
    CONSTRAINT FK_conIDconID FOREIGN KEY (conID) REFERENCES Conditions (conID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_CC_charIDcharID FOREIGN KEY (charID) References Characters (charID) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Conditions_Characters(conID, charID)
VALUES(1, 3),
    (1, 1),
    (3, 2);
SET FOREIGN_KEY_CHECKS = 1;