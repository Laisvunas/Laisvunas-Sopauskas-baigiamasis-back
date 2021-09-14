MRK Diagrammer
=================

MRK Diagrammer is a web app which allows for a team to collaborate in creating, editing and sharing of Modernized Reed-Kellogg syntax diagrams. 

Install
-------

MRK Diagrammer consists of two parts: back-end part and front-end part.

To install back-end part you need to go through following steps.

1. clone git repository from https://github.com/Laisvunas/Laisvunas-Sopauskas-baigiamasis-back

2. create DB tables by running these SQL queries:

```
CREATE TABLE authors (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, password TEXT NOT NULL, editor CHAR DEFAULT 'n');

CREATE TABLE diagrams (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT(6) UNSIGNED, title TEXT, sentence TEXT, json TEXT, code TEXT, commentary TEXT, editors_commentary TEXT, created DATETIME DEFAULT CURRENT_TIMESTAMP);
```

3. Then in the file .env enter MySQL connection details: host, user, password, port, db name.

4. Also in .env file enter secret string which will be used to encode the passwords of the users of the app.

5. Upload the app to the server.

To install back-end part you need to go through following steps.

1. Clone git repository from https://github.com/Laisvunas/Laisvunas-Sopauskas-baigiamasis-front

2. In the file config.js enter the url of the back-end part of the app.

3. Compile the app and upload to the server.


Usage
-----

The users of MRK Diagrammer app have either editor role or author role.

By registering a member aquires the author role.

To elevate an author to the editor's role this sql query should be run:

```
UPDATE authors SET editor = 'y' WHERE id = 'authors_id';
```

The authors can  view, publish diagrams, edit and delete diagrams they have authored.

The editors can view, publish diagrams, edit and delete diagrams of any author. The editors also can write and edit Editor's Commentary under any diagram.

The creation of diagrams themselves is being done outside of MRK Diagrammer by filling and submitting syntaxt data inside a form. The form outputs syntax data in JSON format and syntax diagram in SVG format. Then JSON and SVG strings should be entered in relevant fields in MRK Diagrammer's Publish page.


More Info
-------------

For more information about Reed-Kellogg diagram system refer to

http://talpykla.elaba.lt/elaba-fedora/objects/elaba:18161282/datastreams/MAIN/content
