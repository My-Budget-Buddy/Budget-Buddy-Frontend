--delete later!! use temporarily for testing

-- January
INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 101, 'Amazon', '2024-01-15', 59.99, 'Purchase of electronics', 'SHOPPING'),
(2, 102, 'Starbucks', '2024-01-16', 4.75, 'Coffee and snacks', 'DINING'),
(1, 103, 'Walmart', '2024-01-17', 120, 'Grocery shopping', 'GROCERIES'),
(3, 104, 'Apple Store', '2024-01-18', 999.99, 'New iPhone purchase', 'SHOPPING'),
(2, 105, 'Netflix', '2024-01-19', 15.99, 'Monthly subscription', 'ENTERTAINMENT'),
(4, 106, 'Shell', '2024-01-20', 45.5, 'Gas for car', 'TRANSPORTATION'),
(3, 107, 'Costco', '2024-01-21', 200, 'Bulk shopping', 'GROCERIES'),
(1, 108, 'Uber', '2024-01-22', 25, 'Ride to airport', 'TRANSPORTATION'),
(4, 109, 'Spotify', '2024-01-23', 9.99, 'Monthly subscription', 'ENTERTAINMENT'),
(2, 110, 'Best Buy', '2024-01-24', 499.99, 'Laptop purchase', 'SHOPPING'),
(2, 102, 'Skillstorm', '2024-01-10', 2010.45, 'Paycheck', 'INCOME'),
(1, 101, 'Target', '2024-01-25', 89.99, 'Household items', 'SHOPPING'),
(2, 102, 'McDonalds', '2024-01-26', 8.5, 'Fast food', 'DINING'),
(1, 103, 'Whole Foods', '2024-01-27', 150, 'Organic groceries', 'GROCERIES'),
(3, 104, 'Best Buy', '2024-01-28', 120, 'Electronic gadgets', 'SHOPPING'),
(2, 105, 'Hulu', '2024-01-29', 11.99, 'Monthly subscription', 'ENTERTAINMENT'),
(4, 106, 'Chevron', '2024-01-30', 60, 'Gasoline', 'TRANSPORTATION'),
(3, 107, 'Trader Joes', '2024-01-31', 75, 'Grocery shopping', 'GROCERIES');

-- February
INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 108, 'Lyft', '2024-02-01', 30, 'Ride to downtown', 'TRANSPORTATION'),
(4, 109, 'Amazon Prime', '2024-02-02', 50, 'Broadway show tickets', 'ENTERTAINMENT'),
(2, 110, 'Apple Store', '2024-02-03', 1500, 'New MacBook', 'SHOPPING'),
(1, 101, 'Costco', '2024-02-04', 300, 'Bulk shopping', 'GROCERIES'),
(2, 102, 'Dunkin Donuts', '2024-02-05', 7.5, 'Breakfast', 'DINING'),
(1, 103, 'Safeway', '2024-02-06', 200, 'Groceries', 'GROCERIES'),
(3, 104, 'Microsoft Store', '2024-02-07', 360, 'Jewelry purchase', 'SHOPPING'),
(2, 105, 'Disney+', '2024-02-08', 6.99, 'Monthly subscription', 'ENTERTAINMENT'),
(4, 106, 'ExxonMobil', '2024-02-09', 55, 'Gasoline', 'TRANSPORTATION'),
(3, 107, 'Aldi', '2024-02-10', 50, 'Grocery shopping', 'GROCERIES'),
(1, 108, 'Uber', '2024-02-11', 22, 'Ride to office', 'TRANSPORTATION'),
(4, 109, 'Netflix', '2024-02-12', 15.99, 'Monthly subscription', 'ENTERTAINMENT'),
(2, 110, 'Samsung Store', '2024-02-13', 800, 'New TV', 'SHOPPING'),
(1, 101, 'Walmart', '2024-02-14', 180, 'Groceries and supplies', 'GROCERIES'),
(2, 102, 'Burger King', '2024-02-15', 9, 'Lunch', 'DINING'),
(1, 103, 'Giant', '2024-02-16', 100, 'Groceries', 'GROCERIES'),
(3, 104, 'HP Store', '2024-02-17', 200, 'Printer purchase', 'SHOPPING'),
(2, 105, 'Spotify', '2024-02-18', 9.99, 'Monthly subscription', 'ENTERTAINMENT'),
(4, 106, 'BP', '2024-02-19', 45, 'Gasoline', 'TRANSPORTATION'),
(3, 107, 'Publix', '2024-02-20', 90, 'Grocery shopping', 'GROCERIES'),
(1, 108, 'Lyft', '2024-02-21', 27, 'Ride to gym', 'TRANSPORTATION'),
(4, 109, 'Hulu', '2024-02-22', 11.99, 'Monthly subscription', 'ENTERTAINMENT'),
(2, 110, 'Sony Store', '2024-02-23', 500, 'PlayStation 5', 'SHOPPING');

-- March
INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 101, 'Amazon', '2024-03-05', 79.99, 'Purchase of books', 'SHOPPING'),
(2, 102, 'Subway', '2024-03-10', 12.5, 'Lunch', 'DINING'),
(1, 110, 'Skillstorm', '2024-03-15', 2000, 'Paycheck', 'INCOME');

-- April
INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 101, 'Walmart', '2024-04-02', 45.99, 'Groceries', 'GROCERIES'),
(2, 102, 'Starbucks', '2024-04-08', 15, 'Coffee', 'DINING'),
(1, 110, 'Skillstorm', '2024-04-18', 2100, 'Paycheck', 'INCOME');

-- May
INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 101, 'Target', '2024-05-05', 555.56, 'Clothes', 'SHOPPING'),
(2, 102, 'McDonalds', '2024-05-12', 555.56, 'Dinner', 'DINING'),
(1, 110, 'Skillstorm', '2024-05-20', 2200, 'Paycheck', 'INCOME'),
(1, 101, 'Apple', '2024-05-25', 555.56, 'New MacBook Pro', 'ENTERTAINMENT');

-- June
INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 101, 'Apple Store', '2024-06-07', 999, 'New iPhone', 'SHOPPING'),
(2, 102, 'KFC', '2024-06-14', 20, 'Lunch', 'DINING'),
(1, 110, 'Skillstorm', '2024-06-18', 2300, 'Paycheck', 'INCOME');

-- July
INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 101, 'Best Buy', '2024-07-03', 120, 'Electronics', 'SHOPPING'),
(2, 102, 'Burger King', '2024-07-10', 10.5, 'Snack', 'DINING'),
(1, 110, 'Skillstorm', '2024-07-22', 2400, 'Paycheck', 'INCOME');

-- August
INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 101, 'Nike', '2024-08-01', 150, 'Shoes', 'SHOPPING'),
(2, 102, 'Dunkin Donuts', '2024-08-08', 6, 'Coffee', 'DINING'),
(1, 110, 'Skillstorm', '2024-08-18', 2500, 'Paycheck', 'INCOME');

-- September
INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 101, 'Adidas', '2024-09-05', 100, 'Sportswear', 'SHOPPING'),
(2, 102, 'Chipotle', '2024-09-10', 12, 'Lunch', 'DINING'),
(1, 110, 'Skillstorm', '2024-09-22', 2600, 'Paycheck', 'INCOME');

-- October
INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 101, 'Home Depot', '2024-10-07', 200, 'Home supplies', 'SHOPPING'),
(2, 102, 'Pizza Hut', '2024-10-14', 18, 'Dinner', 'DINING'),
(1, 110, 'Skillstorm', '2024-10-20', 2700, 'Paycheck', 'INCOME');

-- November
INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 101, 'Walmart', '2024-11-05', 75, 'Groceries', 'GROCERIES'),
(2, 102, 'Starbucks', '2024-11-12', 7, 'Coffee', 'DINING'),
(1, 110, 'Skillstorm', '2024-11-18', 2800, 'Paycheck', 'INCOME');

-- December
INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 101, 'Costco', '2024-12-07', 300, 'Bulk shopping', 'SHOPPING'),
(2, 102, 'Panera Bread', '2024-12-14', 14, 'Lunch', 'DINING'),
(1, 110, 'Skillstorm', '2024-12-22', 2900, 'Paycheck', 'INCOME');


INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 110, 'Skillstorm', '2024-02-22', 2900, 'Paycheck', 'INCOME'),
(1, 101, 'Amazon', '2024-01-05', 3000, 'Bulk electronics purchase', 'SHOPPING'),
(1, 101, 'Walmart', '2024-02-10', 3000, 'Furniture purchase', 'GROCERIES'),
(1, 101, 'Best Buy', '2024-03-15', 3000, 'Home theater system', 'MISC'),
(1, 101, 'CVS', '2024-04-20', 3000, 'Home appliances', 'HEALTHCARE'),
(1, 101, 'Apple', '2024-05-25', 555.56, 'New MacBook Pro', 'ENTERTAINMENT'),
(1, 101, 'Home Depot', '2024-06-05', 3000, 'Home renovation materials', 'ENTERTAINMENT'),
(1, 101, 'Costco', '2024-07-10', 3000, 'Bulk groceries', 'GROCERIES'),
(1, 101, 'IKEA', '2024-08-15', 3000, 'New furniture', 'ENTERTAINMENT'),
(1, 101, 'AMC', '2024-09-20', 3000, 'Sports equipment', 'ENTERTAINMENT'),
(1, 101, 'Nike', '2024-10-25', 3000, 'New shoes and apparel', 'SHOPPING'),
(1, 101, 'Rent', '2024-11-05', 3000, 'Rent', 'LIVING_EXPENSES'),
(1, 101, 'Chipotle', '2024-12-10', 3000, 'New TV and accessories', 'DINING'),
(1, 101, 'Nissan', '2024-03-05', 1000.99, 'Purchase of car', 'TRANSPORTATION'),
(1, 101, 'Honda', '2024-03-05', 3000.99, 'Purchase of car', 'TRANSPORTATION');


INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 1, 'Supermarket A', '2023-01-03', 150.25, 'Grocery shopping', 'GROCERIES'),
(1, 1, 'Movie Theater', '2023-01-10', 45, 'Movie tickets', 'ENTERTAINMENT'),
(1, 1, 'Restaurant B', '2023-01-17', 75.5, 'Dinner out', 'DINING'),
(1, 1, 'Gas Station', '2023-01-24', 60, 'Fuel', 'TRANSPORTATION'),
(1, 1, 'Pharmacy', '2023-02-03', 30.75, 'Medicine', 'HEALTHCARE'),
(1, 1, 'Landlord', '2023-02-10', 1200, 'Monthly rent', 'LIVING_EXPENSES'),
(1, 1, 'Clothing Store', '2023-02-17', 200, 'Clothing purchase', 'SHOPPING'),
(1, 1, 'Employer', '2023-02-24', 3500, 'Monthly salary', 'INCOME'),
(1, 1, 'Supermarket B', '2023-03-03', 165.5, 'Grocery shopping', 'GROCERIES'),
(1, 1, 'Concert Venue', '2023-03-10', 100, 'Concert tickets', 'ENTERTAINMENT'),
(1, 1, 'Restaurant C', '2023-03-17', 85.75, 'Dinner out', 'DINING'),
(1, 1, 'Public Transport', '2023-03-24', 45, 'Monthly pass', 'TRANSPORTATION'),
(1, 1, 'Clinic', '2023-04-03', 50, 'Medical check-up', 'HEALTHCARE'),
(1, 1, 'Utilities', '2023-04-10', 150, 'Monthly utilities', 'LIVING_EXPENSES'),
(1, 1, 'Electronics Store', '2023-04-17', 300, 'Electronics purchase', 'SHOPPING'),
(1, 1, 'Employer', '2023-04-24', 3500, 'Monthly salary', 'INCOME'),
(1, 1, 'Misc Store', '2023-04-28', 60, 'Miscellaneous purchase', 'MISC'),
(1, 1, 'Car Dealership', '2023-01-15', 4000, 'Car purchase', 'TRANSPORTATION'),
(1, 1, 'Landlord', '2023-02-20', 4000, 'Monthly rent for a large apartment', 'LIVING_EXPENSES'),
(1, 1, 'Jewelry Store', '2023-03-18', 5000, 'Jewelry purchase', 'SHOPPING'),
(1, 1, 'Home Improvement Store', '2023-04-22', 3000, 'Home renovation', 'MISC');


INSERT INTO transaction (user_id, account_id, vendor_name, transaction_date, transaction_amount, transaction_description, transaction_category) VALUES
(1, 101, 'Supermarket C', '2023-05-01', 555.56, 'Bulk grocery shopping', 'GROCERIES'),
(1, 1, 'Theme Park', '2023-05-02', 555.56, 'Annual passes', 'ENTERTAINMENT'),
(1, 1, 'Luxury Restaurant', '2023-05-03', 555.56, 'Fine dining', 'DINING'),
(1, 1, 'Auto Repair Shop', '2023-05-04', 555.56, 'Car repairs', 'TRANSPORTATION'),
(1, 1, 'Private Clinic', '2023-05-05', 555.56, 'Medical treatment', 'HEALTHCARE'),
(1, 1, 'Real Estate Agency', '2023-05-06', 555.56, 'Rent payment', 'LIVING_EXPENSES'),
(1, 1, 'Designer Store', '2023-05-07', 555.56, 'Designer clothes', 'SHOPPING'),
(1, 1, 'Employer', '2023-05-08', 4500, 'Monthly salary', 'INCOME'),
(1, 1, 'Misc Store', '2023-05-09', 555.56, 'Miscellaneous expenses', 'MISC'),
(1, 1, 'Supermarket C', '2023-05-10', 555.56, 'Bulk grocery shopping', 'GROCERIES'),
(1, 1, 'Concert Venue', '2023-05-11', 555.56, 'VIP concert tickets', 'ENTERTAINMENT'),
(1, 1, 'Luxury Restaurant', '2023-05-12', 555.56, 'Fine dining', 'DINING'),
(1, 1, 'Car Dealership', '2023-05-13', 555.56, 'New tires and maintenance', 'TRANSPORTATION'),
(1, 1, 'Private Clinic', '2023-05-14', 555.56, 'Medical treatment', 'HEALTHCARE'),
(1, 1, 'Real Estate Agency', '2023-05-15', 555.56, 'Rent payment', 'LIVING_EXPENSES'),
(1, 1, 'Electronics Store', '2023-05-16', 555.56, 'Home electronics', 'SHOPPING'),
(1, 1, 'Employer', '2023-05-17', 4000, 'Monthly salary', 'INCOME'),
(1, 1, 'Misc Store', '2023-05-18', 555.56, 'Miscellaneous expenses', 'MISC'),
(1, 1, 'Supermarket C', '2023-05-19', 555.56, 'Bulk grocery shopping', 'GROCERIES'),
(1, 1, 'Sports Arena', '2023-05-20', 555.56, 'Season tickets', 'ENTERTAINMENT'),
(1, 1, 'Luxury Restaurant', '2023-05-21', 555.56, 'Fine dining', 'DINING'),
(1, 1, 'Auto Repair Shop', '2023-05-22', 555.56, 'Car repairs', 'TRANSPORTATION'),
(1, 1, 'Private Clinic', '2023-05-23', 555.56, 'Medical treatment', 'HEALTHCARE'),
(1, 1, 'Real Estate Agency', '2023-05-24', 555.56, 'Rent payment', 'LIVING_EXPENSES'),
(1, 1, 'Furniture Store', '2023-05-25', 555.56, 'Home furniture', 'SHOPPING'),
(1, 1, 'Employer', '2023-05-26', 4700, 'Monthly salary', 'INCOME'),
(1, 1, 'Misc Store', '2023-05-27', 555.56, 'Miscellaneous expenses', 'MISC'),
(1, 1, 'Supermarket C', '2023-05-28', 555.56, 'Bulk grocery shopping', 'GROCERIES'),
(1, 1, 'Broadway Theater', '2023-05-29', 555.56, 'Broadway show tickets', 'ENTERTAINMENT'),
(1, 1, 'Luxury Restaurant', '2023-05-30', 555.56, 'Fine dining', 'DINING'),
(1, 1, 'Car Dealership', '2023-05-31', 555.56, 'Car maintenance', 'TRANSPORTATION'),
(1, 1, 'Private Clinic', '2023-05-28', 555.56, 'Medical treatment', 'HEALTHCARE'),
(1, 1, 'Real Estate Agency', '2023-05-29', 555.56, 'Rent payment', 'LIVING_EXPENSES'),
(1, 1, 'Jewelry Store', '2023-05-30', 555.56, 'Jewelry purchase', 'SHOPPING'),
(1, 1, 'Employer', '2023-05-31', 4900, 'Monthly salary', 'INCOME'),
(1, 1, 'Misc Store', '2023-05-28', 555.56, 'Miscellaneous expenses', 'MISC');
