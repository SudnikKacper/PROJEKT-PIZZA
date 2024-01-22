-- tables
-- Table: Pizza
CREATE TABLE Pizza (
    id int  NOT NULL,
    nazwa varchar(255)  NOT NULL,
    cena decimal(10,2)  NOT NULL,
    img varchar(255)  NOT NULL,
    dostepne boolean  NOT NULL,
    CONSTRAINT Pizza_pk PRIMARY KEY (id)
);

-- Table: Skladniki
CREATE TABLE Skladniki (
    id int AUTO_INCREMENT NOT NULL,
    nazwa varchar(255)  NOT NULL,
    CONSTRAINT Skladniki_pk PRIMARY KEY (id)
);

-- Table: PizzaSkladniki
CREATE TABLE PizzaSkladniki (
    skladnikId int AUTO_INCREMENT NOT NULL,
    pizzaId int  NOT NULL,
    CONSTRAINT PizzaSkladniki_pk PRIMARY KEY (skladnikId,pizzaId)
);

-- Table: User
CREATE TABLE User (
    id int AUTO_INCREMENT NOT NULL,
    username varchar(255)  NOT NULL,
    password varchar(500)  NOT NULL,
    rola varchar(50)  NOT NULL,
    CONSTRAINT User_pk PRIMARY KEY (id)
);

-- Table: Zamowienie
CREATE TABLE Zamowienie (
    id int AUTO_INCREMENT  NOT NULL,
    userId int  NOT NULL,
    imie varchar(255)  NOT NULL,
    status boolean  NOT NULL,
    priorytet int  NOT NULL,
    przewidywanaDostawa datetime  NOT NULL,
    cenaRazem decimal(10,2)  NOT NULL,
    cenaPriorytetu decimal(10,2)  NOT NULL,
    CONSTRAINT Zamowienie_pk PRIMARY KEY (id)
);

-- Table: ZamowionePrzedmioty
CREATE TABLE ZamowionePrzedmioty (
    id int AUTO_INCREMENT NOT NULL,
    pizzaId int  NOT NULL,
    orderId int  NOT NULL,
    nazwa varchar(255)  NOT NULL,
    ilosc int  NOT NULL,
    cenaSzt decimal(10,2)  NOT NULL,
    razem decimal(10,2)  NOT NULL,
    CONSTRAINT ZamowionePrzedmioty_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: PizzaSkladniki_Pizza (table: PizzaSkladniki)
ALTER TABLE PizzaSkladniki ADD CONSTRAINT PizzaSkladniki_Pizza FOREIGN KEY PizzaSkladniki_Pizza (pizzaId)
    REFERENCES Pizza (id);

-- Reference: PizzaSkladniki_Skladniki (table: PizzaSkladniki)
ALTER TABLE PizzaSkladniki ADD CONSTRAINT PizzaSkladniki_Skladniki FOREIGN KEY PizzaSkladniki_Skladniki (skladnikId)
    REFERENCES Skladniki (id);

-- Reference: Zamowienie_User (table: Zamowienie)
ALTER TABLE Zamowienie ADD CONSTRAINT Zamowienie_User FOREIGN KEY Zamowienie_User (userId)
    REFERENCES User (id);

-- Reference: ZamowionePrzedmioty_Pizza (table: ZamowionePrzedmioty)
ALTER TABLE ZamowionePrzedmioty ADD CONSTRAINT ZamowionePrzedmioty_Pizza FOREIGN KEY ZamowionePrzedmioty_Pizza (pizzaId)
    REFERENCES Pizza (id);

-- Reference: ZamowionePrzedmioty_Zamowienie (table: ZamowionePrzedmioty)
ALTER TABLE ZamowionePrzedmioty ADD CONSTRAINT ZamowionePrzedmioty_Zamowienie FOREIGN KEY ZamowionePrzedmioty_Zamowienie (orderId)
    REFERENCES Zamowienie (id);

-- Dla tabeli Pizza
INSERT INTO Pizza (id, nazwa, cena, img, dostepne) VALUES
(1, 'Margherita', 39.99, 'https://cdn.loveandlemons.com/wp-content/uploads/2019/09/margherita-pizza-846x846.jpg', true),
(2, 'Pepperoni', 45.99, 'https://assets.afcdn.com/recipe/20190319/89655_w3072h2304c1cx3680cy2456.jpg', true),
(3, 'Vegetariana', 40.99, 'https://www.twopeasandtheirpod.com/wp-content/uploads/2021/03/Veggie-Pizza-8.jpg', true);


-- Dla tabeli Skladniki
INSERT INTO Skladniki (id, nazwa) VALUES
(1, 'ser'),
(2, 'sos pomidorowy'),
(3, 'pepperoni'),
(4, 'warzywa');

-- Dla tabeli PizzaSkladniki
INSERT INTO PizzaSkladniki (skladnikId, pizzaId) VALUES
(1, 1), -- składnikId 1 dla pizzy o id 1 (Margherita)
(2, 1), -- składnikId 2 dla pizzy o id 1 (Margherita)
(1, 2), -- składnikId 1 dla pizzy o id 2 (Pepperoni)
(2, 2), -- składnikId 2 dla pizzy o id 2 (Pepperoni)
(3, 2), -- składnikId 3 dla pizzy o id 2 (Pepperoni)
(1, 3), -- składnikId 1 dla pizzy o id 3 (Vegetariana)
(2, 3), -- składnikId 2 dla pizzy o id 3 (Vegetariana)
(4, 3); -- składnikId 4 dla pizzy o id 3 (Vegetariana)

-- Dla tabeli User
INSERT INTO User (id, username, password, rola) VALUES
(1, 'TEST', '$2b$10$E/BApm3wVwEhYzEvOQGd1uHwZzhy2xy/soyQLJyjwbVJSilJ4zi4u', 'User'),
(2, 'adm', '$2b$10$NA0HuERNIr/ragI/uznQSuPZzBBp03ymADn8Mf30BJeilms9PjLMy', 'Admin');

-- Dla tabeli Zamowienie
INSERT INTO Zamowienie (id, userId, imie, status, priorytet, przewidywanaDostawa, cenaRazem, cenaPriorytetu) VALUES
(1, 1, 'kacper', false, 1, '2024-01-15 18:00:00', 21.98, 5.00),
(2, 2, 'kacper', true, 2, '2024-01-10 20:30:00', 33.97, 10.00);

-- Dla tabeli ZamowionePrzedmioty
INSERT INTO ZamowionePrzedmioty (id, pizzaId, orderId, nazwa, ilosc, cenaSzt, razem) VALUES
(1, 1, 1, 'Margherita', 2, 39.99, 79.89),
(2, 2, 1, 'Pepperoni', 1, 45.99, 45.99),
(3, 3, 2, 'Vegetariana', 3, 40.99, 122.97);


-- End of file.
