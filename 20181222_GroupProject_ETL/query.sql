-- example join statements
-- need to join on both store and date
SELECT features.Date, features.Store, sales.Dept, stores.Size, stores.Type, sales.Weekly_Sales, features.IsHoliday, features.MarkDown1, features.MarkDown2, features.MarkDown3, features.MarkDown4, features.MarkDown5, features.Temperature, features.Fuel_Price, features.CPI, features.Unemployment
FROM features
RIGHT JOIN sales ON features.Store = sales.Store AND features.Date = sales.Date
LEFT JOIN stores ON sales.Store = stores.Store;

