CREATE TABLE Users(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
cash DECIMAL(15,4) NOT NULL DEFAULT 50000.00, /* To handle situations where stocks have cent value less than 0.01 */
`password` VARCHAR(64) NOT NULL /* USE SHA256 */
);

CREATE TABLE Transactions(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
userID INT NOT NULL REFERENCES Users(id),
stock VARCHAR(10) NOT NULL,
pricePerStock DECIMAL(15,4) NOT NULL, /* To handle situations where stocks have cent value less than 0.01 */
`type` VARCHAR(4) NOT NULL
);

CREATE TABLE Ownership(
userID INT NOT NULL REFERENCES Users(id),
stock VARCHAR(5) NOT NULL,
qty INT NOT NULL,
PRIMARY KEY (userID, stock)
);