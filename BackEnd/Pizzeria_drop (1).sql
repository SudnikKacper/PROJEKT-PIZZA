-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-01-01 17:46:24.54

-- foreign keys
ALTER TABLE PizzaSkladniki
    DROP FOREIGN KEY PizzaSkladniki_Pizza;

ALTER TABLE PizzaSkladniki
    DROP FOREIGN KEY PizzaSkladniki_Skladniki;

ALTER TABLE Zamowienie
    DROP FOREIGN KEY Zamowienie_User;

ALTER TABLE ZamowionePrzedmioty
    DROP FOREIGN KEY ZamowionePrzedmioty_Pizza;

ALTER TABLE ZamowionePrzedmioty
    DROP FOREIGN KEY ZamowionePrzedmioty_Zamowienie;

-- tables
DROP TABLE Pizza;

DROP TABLE PizzaSkladniki;

DROP TABLE Skladniki;

DROP TABLE User;

DROP TABLE Zamowienie;

DROP TABLE ZamowionePrzedmioty;

-- End of file.

