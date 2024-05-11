// server.js

// Import dependencies
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const mysql = require('mysql2');

// Create an Express app
const app = express();

const bcrypt = require('bcrypt');

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Directly specify database credentials
const db = mysql.createConnection({
    host: 'localhost', // Replace with your DB host
    user: 'root',      // Replace with your DB user
    password: 'IlovePHYSICS2003.', // Replace with your DB password
    database: 'bluMAppDB' // Replace with your DB name
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        process.exit(1); // Exit if there's a database connection error
    } else {
        console.log('Connected to database as id', db.threadId);
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')  // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) // Appending extension
    }
});

const upload = multer({ storage: storage });

app.post('/api/posts/publish', upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { userID, description } = req.body;
    const mediaPath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    // Determine content type based on the file extension
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv'];
    let contentType = 'image'; // Default to image

    if (videoExtensions.includes(fileExtension)) {
        contentType = 'video';
    } else if (!imageExtensions.includes(fileExtension)) {
        return res.status(400).send('Unsupported file type.');
    }

    // Store post details in the database
    const query = 'INSERT INTO POSTS (content_type, post_content, date_created, active, description, blums, stars, userID) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, TRUE, 0, 0)';
    db.query(query, [userID, description, mediaPath, contentType], (err, result) => {
        if (err) {
            console.error('Failed to insert post:', err);
            return res.status(500).send('Error posting to the database');
        }
        res.status(201).send({ success: true, message: 'Post published successfully!' });
    });
});

// API endpoint to fetch all dishes
app.get('/api/dishes', (req, res) => {
    db.query('SELECT * FROM DISHES', (err, results) => {
        if (err) {
            console.error('Failed to retrieve dishes from database:', err);
            return res.status(500).send('Error fetching dishes from the database');
        }
        res.json(results); // Send results as JSON
    });
});

app.get('/api/dishes/:dishId', (req, res) => {
    const { dishId } = req.params;
    db.query('SELECT * FROM DISHES WHERE id = ?', [dishId], (err, results) => {
        if (err) {
            console.error(`Failed to retrieve dish with ID ${dishId} from database:`, err);
            return res.status(500).send('Error fetching dish from the database');
        }
        if (results.length === 0) {
            return res.status(404).send('Dish not found');
        }
        res.json(results[0]);
    });
});

app.get('/api/dishes/:dishId/ingredients', (req, res) => {
    const { dishId } = req.params;

    const query = `
        SELECT 
            i.id, 
            i.title, 
            i.image, 
            i.package,
            i.price,
            di.quantity 
        FROM DISH_INGREDIENT di
        JOIN INGREDIENTS i ON di.ingredient_id = i.id
        WHERE di.dish_id = ?
    `;

    db.query(query, [dishId], (err, results) => {
        if (err) {
            console.error(`Failed to retrieve ingredients for dish with ID ${dishId}:`, err);
            return res.status(500).send('Error fetching ingredients from the database');
        }
        res.json(results); // Send results as JSON
    });
});

// Endpoint to fetch ingredients for a specific dish
app.get('/api/dishes/:dishId/ingredients', (req, res) => {
    const { dishId } = req.params;

    const query = `
        SELECT 
            i.id, 
            i.title, 
            i.image, 
            i.package,
            i.price,
            di.quantity 
        FROM DISH_INGREDIENT di
        JOIN INGREDIENTS i ON di.ingredient_id = i.id
        WHERE di.dish_id = ?
    `;

    db.query(query, [dishId], (err, results) => {
        if (err) {
            console.error(`Failed to retrieve ingredients for dish with ID ${dishId}:`, err);
            return res.status(500).send('Error fetching ingredients from the database');
        }
        res.json(results); // Send results as JSON
    });
});

// In your server.js (Node.js server code)
app.get('/api/ingredients', (req, res) => {
    const query = `SELECT * FROM INGREDIENTS`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching ingredients:', err);
            return res.status(500).send('Error fetching ingredients from the database');
        }
        res.json(results);
    });
});

app.get('/api/ingredients/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM INGREDIENTS WHERE id = ?`;
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching ingredient:', err);
            return res.status(500).send('Error fetching ingredient from the database');
        }
        if (results.length === 0) {
            return res.status(404).send('Ingredient not found');
        }
        res.json(results[0]);
    });
});

// API to search each of the ingredients corresponding to their category.
app.get('/api/ingredient/:category', (req, res) => {
    const validCategories = ['Epices', 'Legumes', 'Viande', 'Condiments']; // List of valid categories
    const category = req.params.category;

    // Check if the requested category is valid
    if (!validCategories.includes(category)) {
        return res.status(400).send('Invalid category');
    }

    const query = `SELECT * FROM INGREDIENTS WHERE category = ?`;
    db.query(query, [category], (err, results) => {
        if (err) {
            console.error(`Error fetching ${category}:`, err);
            return res.status(500).send(`Error fetching ${category} from the database`);
        }
        res.json(results);
    });
});

// Api to load all the African dishes from the DISHES table.
app.get('/api/american-dishes', (req, res) => {
    const query = `SELECT * FROM DISHES WHERE category = 'Americans'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching American dishes:', err);
            return res.status(500).send('Error fetching American dishes from the database');
        }
        res.json(results);
    });
});

// Api to load all the African dishes from the DISHES table.
app.get('/api/african-dishes', (req, res) => {
    const query = `SELECT * FROM DISHES WHERE category = 'Africans'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching African dishes:', err);
            return res.status(500).send('Error fetching African dishes from the database');
        }
        res.json(results);
    });
});

// Api to load all the Asian dishes from the DISHES table.
app.get('/api/asian-dishes', (req, res) => {
    const query = `SELECT * FROM DISHES WHERE category = 'Asians'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching Asian dishes:', err);
            return res.status(500).send('Error fetching Asian dishes from the database');
        }
        res.json(results);
    });
});

// Api to load all the European dishes from the DISHES table.
app.get('/api/european-dishes', (req, res) => {
    const query = `SELECT * FROM DISHES WHERE category = 'Europeans'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching European dishes:', err);
            return res.status(500).send('Error fetching European dishes from the database');
        }
        res.json(results);
    });
});

// Api to search for a particular food in the DISHES table. 
// It is used in the RecipeScreen's SearchBar.
app.get('/api/search/foods', (req, res) => {
    const { query } = req.query;
    const sqlQuery = `SELECT * FROM DISHES WHERE title LIKE ?`;
    db.query(sqlQuery, [`%${query}%`], (err, results) => {
        if (err) {
            console.error('Error searching foods:', err);
            return res.status(500).send('Error searching foods');
        }
        res.json(results);
    });
});

// Api to search for a particular ingredient in the INGREDIENTS table. 
// It is used in the IngredientsScreen's SearchBar.
app.get('/api/search/ingredients', (req, res) => {
    const { query } = req.query;
    const sqlQuery = `SELECT * FROM INGREDIENTS WHERE title LIKE ?`;
    db.query(sqlQuery, [`%${query}%`], (err, results) => {
        if (err) {
            console.error('Error searching ingredients:', err);
            return res.status(500).send('Error searching ingredients');
        }
        res.json(results);
    });
});

app.get('/api/search/:category', (req, res) => {
    const { category } = req.params;
    const searchTerm = req.query.query;
    let query = '';

    // Define categories that belong to DISHES
    const dishCategories = ['Africans', 'Americans', 'Asians', 'Europeans'];

    // Check the category and decide the query based on the type
    if (dishCategories.includes(category)) {
        query = `SELECT * FROM DISHES WHERE category = ? AND title LIKE ?`;
    } else {
        query = `SELECT * FROM INGREDIENTS WHERE category = ? AND title LIKE ?`;
    }

    db.query(query, [category, `%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error(`Error searching in category ${category}:`, err);
            return res.status(500).send(`Error searching in category ${category}`);
        }
        res.json(results);
    });
});


app.get('/api/posts', (req, res) => {
    const query = `
        SELECT p.postID, p.content_type, p.post_content, p.date_created, p.active, p.description, p.blums, p.stars, 
               u.name, u.surname, u.profile_picture, p.userID, u.userID, u.email, u.phone_number, u.postal_address, u.country_of_origin
        FROM POSTS p
        JOIN USERS u ON p.userID = u.userID
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Failed to retrieve posts:', err);
            return res.status(500).send('Error fetching posts from the database');
        }
        res.json(results); // Send results as JSON
    });
});

// API endpoint to fetch a specific user by userID
app.get('/api/users/:userID', (req, res) => {
    const { userID } = req.params;
    db.query('SELECT * FROM USERS WHERE userID = ?', [userID], (err, results) => {
        if (err) {
            console.error(`Failed to retrieve user with ID ${userID} from database:`, err);
            return res.status(500).send('Error fetching user from the database');
        }
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        res.json(results[0]);
    });
});

app.get('/api/posts/:postId/comments', (req, res) => {
    const { postId } = req.params;

    // Query to fetch comments for a specific post, along with user information
    const query = `
        SELECT c.commentID, c.comment_text, c.date_created, u.name, u.surname, u.profile_picture
        FROM COMMENTS c
        JOIN USERS u ON c.userID = u.userID
        WHERE c.postID = ?
    `;

    db.query(query, [postId], (err, results) => {
        if (err) {
            console.error('Failed to retrieve comments:', err);
            return res.status(500).send('Error fetching comments from the database');
        }
        res.json(results); // Send results as JSON
    });
});

app.get('/api/posts/:postId/comments/count', (req, res) => {
    const postId = req.params.postId;
    const sql = 'SELECT COUNT(*) AS commentsCount FROM comments WHERE postID = ?';
    db.query(sql, [postId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ commentsCount: result[0].commentsCount });
    });
});

// server.js
app.get('/api/posts', (req, res) => {
    const sql = `
        SELECT posts.*, u.name, u.surname, u.profile_picture, u.userID, u.email, u.phone_number, u.postal_address
        (SELECT COUNT(*) FROM comments WHERE comments.postID = posts.postID) AS commentsCount
        FROM POSTS posts
        LEFT JOIN USERS u ON posts.userID = u.userID
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// server.js

// Toggle like on a post

// server.js
app.post('/api/posts/:postId/toggle-like', (req, res) => {
    const { postId } = req.params;
    const { liked } = req.body; // true if liked, false if not

    const updateQuery = liked
        ? 'UPDATE POSTS SET blums = blums + 1 WHERE postID = ?'
        : 'UPDATE POSTS SET blums = blums - 1 WHERE postID = ?';

    const selectQuery = 'SELECT blums FROM POSTS WHERE postID = ?';

    db.query(updateQuery, [postId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Fetch the updated count and return it
        db.query(selectQuery, [postId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, blums: results[0].blums });
        });
    });
});

// server.js
app.post('/api/posts/:postId/toggle-star', (req, res) => {
    const { postId } = req.params;
    const { starred } = req.body; // true if starred, false if not

    const updateQuery = starred
        ? 'UPDATE POSTS SET stars = stars + 1 WHERE postID = ?'
        : 'UPDATE POSTS SET stars = stars - 1 WHERE postID = ?';

    const selectQuery = 'SELECT stars FROM POSTS WHERE postID = ?';

    db.query(updateQuery, [postId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Fetch the updated count and return it
        db.query(selectQuery, [postId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, stars: results[0].stars });
        });
    });
});

// server.js
app.post('/api/posts/:postId/comments', (req, res) => {
    const { postId } = req.params;
    const { userId, comment_text } = req.body;

    const query = 'INSERT INTO COMMENTS (postID, userID, comment_text) VALUES (?, ?, ?)';
    db.query(query, [postId, userId, comment_text], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, commentID: result.insertId });
    });
});

// server.js
app.post('/api/follow', (req, res) => {
    const { blumerID, blumeeID } = req.body;

    const query = 'INSERT INTO BLUMERS (blumerID, blumeeID) VALUES (?, ?)';
    db.query(query, [blumerID, blumeeID], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Already following this user' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
});


// server.js
app.get('/api/follow-status', (req, res) => {
    const { blumerID, blumeeID } = req.query;

    const query = 'SELECT * FROM BLUMERS WHERE blumerID = ? AND blumeeID = ?';
    db.query(query, [blumerID, blumeeID], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ isFollowing: results.length > 0 });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = 'SELECT userID, name, surname, email, phone_number, postal_address, country_of_origin, profile_picture, password FROM USERS WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const user = results[0];

        // Check if the provided password matches the stored password
        if (password === user.password) {
            // Return all the necessary user details
            res.status(200).json({
                success: true,
                userID: user.userID,
                name: user.name,
                surname: user.surname,
                email: user.email,
                phone_number: user.phone_number,
                postal_address: user.postal_address,
                country_of_origin: user.country_of_origin,
                profile_picture: user.profile_picture
            });
        } else {
            res.status(401).json({ error: 'Invalid Credentials' });
        }
    });
});

app.post('/api/register', async (req, res) => {
    const { name, surname, email, postalAddress, phoneNumber, countryOfOrigin, profilePicture, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
        INSERT INTO USERS (name, surname, email, postal_address, phone_number, country_of_origin, profile_picture, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [name, surname, email, postalAddress, phoneNumber, countryOfOrigin, profilePicture, hashedPassword], (err) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ success: true });
    });
});

app.get('/api/users/:userId/blumers', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT u.userID, u.name, u.surname, u.profile_picture 
        FROM BLUMERS b
        JOIN USERS u ON u.userID = b.blumerID
        WHERE b.blumeeID = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/users/:userId/blumees', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT u.userID, u.name, u.surname, u.profile_picture 
        FROM BLUMERS b
        JOIN USERS u ON u.userID = b.blumeeID
        WHERE b.blumerID = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT name, surname, email, phone_number, postal_address, country_of_origin, profile_picture FROM USERS WHERE userID = ?';
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(results[0]);
    });
});

app.post('/api/users/:userID/update', (req, res) => {
    const { userID } = req.params;
    const { name, surname, email, phone_number, postal_address, country_of_origin, profile_picture } = req.body;

    const sql = `
        UPDATE USERS
        SET
            name = ?,
            surname = ?,
            email = ?,
            phone_number = ?,
            postal_address = ?,
            country_of_origin = ?,
            profile_picture = ?,
        WHERE userID = ?
    `;

    db.query(sql, [name, surname, email, phone_number, postal_address, country_of_origin, profile_picture, userID], (err, result) => {
        if (err) {
            console.error('Failed to update user:', err);
            return res.status(500).send('Failed to update user');
        }
        res.json({ success: true, message: 'Profile updated successfully' });
    });
});



// Directly specify server port
const port = 3006; // Replace with your desired port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
