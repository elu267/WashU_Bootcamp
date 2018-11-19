-- 1a displaying the first and last names of all actors from the table actor
USE sakila;
SELECT
    first_name, last_name
FROM
    actor
ORDER BY 2 , 1; -- added this to see if the table had duplicates

-- 1b displaying the first and last name of each actor in a single 
-- column in upper case letters and naming the column Actor Name
SELECT 
    CONCAT(UPPER(first_name), ' ', UPPER(last_name)) AS Actor_Name
FROM
    actor;

-- 2a find the ID number, first name, and last name of an actor, of whom you know
-- only the first name, Joe. This query will obtain that information
SELECT 
    actor_ID, first_name, last_name
FROM
    actor
WHERE
    first_name = 'Joe';

-- 2b Find all actors whose last name contain the letters GEN
SELECT 
    first_name, last_name
FROM
    actor
WHERE
    last_name LIKE '%GEN%';

-- 2c Find all actors whose last names contain the letters LI. Order the rows by last name and first name, in that order
SELECT 
    first_name, last_name
FROM
    actor
WHERE
    last_name LIKE '%LI%'
ORDER BY 2 , 1;

-- 2d Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China
SELECT 
    country_id, country
FROM
    country
WHERE
    country IN ('Afghanistan' , 'Bangladesh', 'China');

-- 3a. You want to keep a description of each actor. You don't think you will be performing queries on a description, so create 
-- a column in the table actor named description and use the data type BLOB (Make sure to research the type BLOB, as the 
-- difference between it and VARCHAR are significant).

-- BLOB values are treated as binary strings (byte strings). They have no character set, and sorting and comparison are based on the numeric values of the bytes in column values.
-- You cannot analyze the text in a BLOB type; you would use BLOB type only when the value of the text was not worth analyzing such as storing the technical name of something - use this type to save space in the database.
-- VARCHAR values are treated as nonbinary strings (character strings). They have a character set, and values are sorted and compared based on the collation of the character set.
-- You would want to use VARCHAR or TEXT types if your use case required you to analyze the text - like for sentiment analysis

ALTER TABLE actor
ADD COLUMN description BLOB;

-- 3b. Very quickly you realize that entering descriptions for each actor is too much effort. Delete the description column.

ALTER TABLE actor
DROP COLUMN description;


-- 4a. List the last names of actors, as well as how many actors have that last name.
SELECT 
    last_name, COUNT(last_name)
FROM
    actor
GROUP BY last_name;

-- 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by 
-- at least two actors.
SELECT 
    last_name, COUNT(last_name)
FROM
    actor
GROUP BY last_name
HAVING COUNT(last_name) > 1;

-- 4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. Write a query 
-- to fix the record.

UPDATE actor 
SET 
    first_name = 'HARPO'
WHERE
    first_name = 'GROUCHO'
        AND last_name = 'WILLIAMS';

-- select first_name, last_name
-- from actor
-- where first_name = 'HARPO';

-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! 
-- In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO.
UPDATE actor 
SET 
    first_name = 'GROUCHO'
WHERE
    first_name = 'HARPO'
        AND last_name = 'WILLIAMS';

-- select first_name, last_name
-- from actor
-- where first_name = 'GROUCHO';

-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
SHOW CREATE TABLE address;

-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff 
-- and address
SELECT
	first_name,
    last_name,
    address
FROM staff s
JOIN
address a ON (s.address_id = a.address_id);

-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
SELECT 
    first_name, last_name, SUM(amount) AS total_sales
FROM
    staff
        JOIN
    payment USING (staff_id)
WHERE
    payment_date LIKE '2005-08%'
GROUP BY 2 , 1;

-- 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
SELECT 
    title, COUNT(actor_id) AS 'Number of Actors'
FROM
    film f
        INNER JOIN
    film_actor a ON (f.film_id = a.film_id)
GROUP BY 1
ORDER BY 2 DESC; -- I know this was not required but I really wanted to see them in descending order

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT 
    COUNT(inventory_id) AS 'Copies of Hunchback Impossible'
FROM
    inventory
        INNER JOIN
    film ON (inventory.film_id = film.film_id)
WHERE
    title = 'Hunchback Impossible'
GROUP BY inventory.film_id;

-- 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers 
-- alphabetically by last name
SELECT 
    first_name, last_name, SUM(amount) AS 'Total Paid'
FROM
    customer c
        JOIN
    payment p ON (c.customer_id = p.customer_id)
GROUP BY c.customer_id
ORDER BY 2;

-- 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, 
-- films starting with the letters K and Q have also soared in popularity. Use subqueries to display the titles of movies 
-- starting with the letters K and Q whose language is English.
SELECT 
    title
FROM
    film
WHERE
    title LIKE 'K%'
        OR title LIKE 'Q%'
        AND language_id IN (SELECT 
            language_id
        FROM
            film
        WHERE
            language_id = 1);

-- 7b. Use subqueries to display all actors who appear in the film Alone Trip.
SELECT 
    first_name, last_name
FROM
    actor
WHERE
    actor_id IN (SELECT 
            actor_id
        FROM
            film_actor
        WHERE
            film_id IN (SELECT 
                    film_id
                FROM
                    film
                WHERE
                    title = 'Alone Trip'));


-- 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses 
-- of all Canadian customers. Use joins to retrieve this information.
SELECT 
    first_name, last_name, email
FROM
    customer c
        JOIN
    address a ON (c.address_id = a.address_id)
        JOIN
    city ON (a.city_id = city.city_id)
        JOIN
    country ctry ON (city.country_id = ctry.country_id)
WHERE
    ctry.country = 'Canada';

-- 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. 
-- Identify all movies categorized as family films.
SELECT 
    title AS 'Family Movie Titles'
FROM
    film f
        JOIN
    film_category fc ON (f.film_id = fc.film_id)
        JOIN
    category c ON (fc.category_id = c.category_id)
WHERE
    c.`name` = 'family';

-- 7e. Display the most frequently rented movies in descending order.
SELECT 
    title, COUNT(rental_date) AS 'Rental Count Frequency'
FROM
    film f
        JOIN
    inventory i ON (f.film_id = i.film_id)
        JOIN
    rental r ON (i.inventory_id = r.inventory_id)
GROUP BY title
ORDER BY 2 DESC;

-- 7f. Write a query to display how much business, in dollars, each store brought in.
-- writing it myself
SELECT 
    CONCAT(UPPER(c.city), ', ', UPPER(ctry.country)) AS 'Store',
    SUM(amount) AS 'Sales in Dollars'
FROM
    store s
        JOIN
    inventory i ON (s.store_id = i.store_id)
        JOIN
    rental r ON (i.inventory_id = r.inventory_id)
        JOIN
    payment p ON (r.rental_id = p.rental_id)
        JOIN
    address a ON (s.address_id = a.address_id)
        JOIN
    city c ON (a.city_id = c.city_id)
        JOIN
    country ctry ON (c.country_id = ctry.country_id)
GROUP BY s.store_id
ORDER BY SUM(amount);

-- using the view that is already available
SELECT store, total_sales
FROM sales_by_store;

-- 7g. Write a query to display for each store its store ID, city, and country.
SELECT 
    s.store_id, c.city, ctry.country
FROM
    store s
        JOIN
    address a ON (s.address_id = a.address_id)
        JOIN
    city c ON (a.city_id = c.city_id)
        JOIN
    country ctry ON (c.country_id = ctry.country_id)
GROUP BY s.store_id;

-- 7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: 
-- category, film_category, inventory, payment, and rental.)
SELECT 
    c.`name` AS 'Genre', SUM(amount) AS 'Gross Revenue'
FROM
    category c
        JOIN
    film_category fc ON (c.category_id = fc.category_id)
        JOIN
    inventory i ON (fc.film_id = i.film_id)
        JOIN
    rental r ON (i.inventory_id = r.inventory_id)
        JOIN
    payment p ON (r.rental_id = p.rental_id)
GROUP BY c.`name`
ORDER BY 2 DESC
LIMIT 5;

-- 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross 
-- revenue. Use the solution from the problem above to create a view. If you haven't solved 7h, 
-- you can substitute another query to create a view.
CREATE VIEW Top_Five_Genres_by_Gross_Revenue AS
    SELECT 
        c.`name` AS 'Genre', SUM(amount) AS 'Gross Revenue'
    FROM
        category c
            JOIN
        film_category fc ON (c.category_id = fc.category_id)
            JOIN
        inventory i ON (fc.film_id = i.film_id)
            JOIN
        rental r ON (i.inventory_id = r.inventory_id)
            JOIN
        payment p ON (r.rental_id = p.rental_id)
    GROUP BY c.`name`
    ORDER BY 2 DESC
    LIMIT 5;

-- 8b. How would you display the view that you created in 8a?
SELECT * FROM Top_Five_Genres_by_Gross_Revenue;

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
DROP VIEW IF EXISTS
	Top_Five_Genres_by_Gross_Revenue;