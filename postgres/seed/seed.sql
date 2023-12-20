BEGIN TRANSACTION;

INSERT into users(name, email, entries, joined) values ('Serhii', 'serhii@gmail.com', 5, '2023-12-19 03:31:53.566');
INSERT into login(hash, email) values ('$2a$10$viFXryyxZBbpKGLeGf4cz.W6GLxp4p3PiF7hyvV/f110vB4UlAfHS','serhii@gmail.com');

COMMIT;