INSERT INTO users VALUES
    (default, 'demo@kuato.com', '$2a$08$Saidu4Z5VkIdChZg78xqJOzuW.HwEaSGbmGy3C4HiKlSsMK1z3.sy');

INSERT INTO decks VALUES
    (default, 1, 'JavaScript', 'Wed Jan 13 2016 22:58:08 GMT-0700 (MST)'),
    (default, 1, 'AngularJS', 'Wed Jan 13 2016 22:58:08 GMT-0700 (MST)'),
    (default, 1, 'Express', 'Wed Jan 13 2016 22:58:08 GMT-0700 (MST)');

INSERT INTO cards VALUES
    (default, 1, 'This is a sample question', 'This is a sample answer', 1, '12/24/15'),
    (default, 1, 'Another sample question', 'Another sample answer', 2, '12/12/15'),
    (default, 1, 'Third Question', 'Third Answer', 3, '12/14/2015'),
    (default, 2, 'What is a directive?', 'A directive is a custom HTML attribute or element', 1, '12/12/15'),
    (default, 2, 'What is a factory?', 'A factory is a singleton object invoked at runtime and accessible throughout the app', 2, '12/24/15'),
    (default, 2, 'What is a provider', 'A provider is a top-level component which provides services to lower-level components', 1, '12/10/15'),
    (default, 3, 'What is middleware?', 'Middleware runs its code before your routes run theirs', 1, '12/01/15'),
    (default, 3, 'What is a module?', 'A module is an independent set of functions that you can require in your app', 2, '12/15/15'),
    (default, 3, 'What does the keyword require do?', 'Includes the functionality of the module you are linking to in context in which you write your require statement', 3, '12/22/15');