-- create and use retail_db
CREATE DATABASE retail_db;
USE retail_db;

-- create three tables
CREATE TABLE stores (
    id INT(15) auto_increment primary key,
    Store bigint(20),
    Type TEXT,
    Size INT(11)
);


CREATE TABLE features (
    id INT(15) auto_increment primary key,
    store bigint(20),
    date DATE,
    temperature FLOAT,
    fuel_price FLOAT,
    markdown1 FLOAT,
    markdown2 FLOAT,
    markdown3 FLOAT,
    markdown4 FLOAT,
    markdown5 FLOAT,
    CPI FLOAT,
    unemployment FLOAT,
    is_holiday tinyint(1)
);

CREATE TABLE sales (
    id int(30) auto_increment primary key,
    store bigint(20),
    dept int(3),
    date DATE,
    weekly_sales FLOAT
);

-- statements for refereshes of data
truncate table stores;
truncate table features;
truncate table sales;

