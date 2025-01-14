// Import dependencies
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const stripe = require('stripe')('sk_test_51PIRk7DIrmiE2Hgb3odn47yqCN3ojcMsp70vzrz93fqUIeOxtl35xvqdzBNX8Tji2UkxtdJvnWxgNDpRlPS80AA900horxTCdC');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const { format } = require('date-fns');
const twilio = require('twilio');

// Configure your Twilio client
const twilioClient = twilio('ACd2a202df6a7bec7411f181e00870cd8a', '9ed94e6070fe4bb5f35115d3ebdae3e4');
const twilioPhoneNumber = 8197018694 ;
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json());

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

const sendResetCodeViaSMS = (phone_number, resetCode) => {
    twilioClient.messages
        .create({
            body: `Your password reset code is: ${resetCode}`,
            from: twilioPhoneNumber,
            to: phone_number
        })
        .then(message => console.log(`SMS sent: ${message.sid}`))
        .catch(error => console.error('Error sending SMS:', error));
};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'macroysimen@gmail.com', // Your email address
        pass: 'djkq opub iyxg ajud', // Your email password
    },
    tls: {
        rejectUnauthorized: false // This may help if there are issues with the server's SSL/TLS configuration
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to take our messages');
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

app.post('/api/dish', (req, res) => {
    const {
        title,
        category,
        description,
        preparation,
        recommendations,
        portions,
        difficulty,
        image,
        videoUrl,
        price,
        dishBlums,
        countryFlag,
        nutritiveFacts,
        dishDisblums,
    } = req.body;

    const query = `
        INSERT INTO DISHES (
            title, category, description, preparation, recommendations, 
            portions, difficulty, image, video_url, price, 
            dish_blums, countryFlag, nutritiveFacts, dish_disblums
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        title,
        category,
        description,
        preparation,
        recommendations,
        portions,
        difficulty,
        image,
        videoUrl,
        price,
        dishBlums,
        countryFlag,
        nutritiveFacts,
        dishDisblums,
    ], (err, result) => {
        if (err) {
            console.error('Error inserting dish into database:', err);
            return res.status(500).send({ success: false, message: 'Failed to add dish' });
        }
        res.send({ success: true, message: 'Dish added successfully!' });
    });
});

// API endpoint to fetch all dishes
app.get('/api/dishes', (req, res) => {
    db.query('SELECT * FROM DISHES ORDER BY RAND()', (err, results) => {
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

app.get('/api/dishes/:dishID/likes_dislikes', (req, res) => {
    const { dishID } = req.params;
    const { userID } = req.query; // Assuming userID is passed as a query parameter

    const sql = `
        SELECT dish_blums AS likes, dish_disblums AS dislikes,
        (SELECT liked FROM USER_LIKES_DISLIKES WHERE userID = ? AND id = ?) AS userLiked,
        (SELECT disliked FROM USER_LIKES_DISLIKES WHERE userID = ? AND id = ?) AS userDisliked
        FROM DISHES
        WHERE id = ?
    `;

    db.query(sql, [userID, dishID, userID, dishID, dishID], (err, results) => {
        if (err) {
            console.error(`Failed to retrieve likes/dislikes for dish with ID ${dishID} from database:`, err);
            return res.status(500).send('Error fetching likes/dislikes from the database');
        }
        if (results.length === 0) {
            return res.status(404).send('Dish not found');
        }
        res.json(results[0]);
    });
});


app.post('/api/dishes/:dishID/like', (req, res) => {
    const { dishID } = req.params;
    const { userID } = req.body;

    const checkSql = 'SELECT * FROM USER_LIKES_DISLIKES WHERE userID = ? AND id = ?';
    db.query(checkSql, [userID, dishID], (err, results) => {
        if (err) {
            console.error(`Failed to check likes for dish with ID ${dishID}:`, err);
            return res.status(500).send('Error checking likes');
        }

        if (results.length > 0 && results[0].liked) {
            return res.status(400).json({success: false, message: 'User has already liked this dish'});
        } else if (results.length > 0 && results[0].disliked) {
            return res.status(400).json({success: false, message: 'User has already disliked this dish'});
        }

        const updateSql = 'UPDATE DISHES SET dish_blums = dish_blums + 1 WHERE id = ?';
        db.query(updateSql, [dishID], (err, result) => {
            if (err) {
                console.error(`Failed to update likes for dish with ID ${dishID}:`, err);
                return res.status(500).send('Error updating likes');
            }

            const insertSql = `
                INSERT INTO USER_LIKES_DISLIKES (userID, id, liked)
                VALUES (?, ?, 1)
                ON DUPLICATE KEY UPDATE liked = 1, disliked = NULL
            `;
            db.query(insertSql, [userID, dishID], (err, result) => {
                if (err) {
                    console.error(`Failed to update user likes for dish with ID ${dishID}:`, err);
                    return res.status(500).send('Error updating user likes');
                }
                res.json({ success: true, message: 'Like added successfully' });
            });
        });
    });
});

app.post('/api/dishes/:dishID/dislike', (req, res) => {
    const { dishID } = req.params;
    const { userID } = req.body;

    const checkSql = 'SELECT * FROM USER_LIKES_DISLIKES WHERE userID = ? AND id = ?';
    db.query(checkSql, [userID, dishID], (err, results) => {
        if (err) {
            console.error(`Failed to check dislikes for dish with ID ${dishID}:`, err);
            return res.status(500).send('Error checking dislikes');
        }

        if (results.length > 0 && results[0].disliked) {
            return res.status(400).json({ success: false, message: 'User has already disliked this dish' });
        } else if (results.length > 0 && results[0].liked) {
            return res.status(400).json({ success: false, message: 'User has already liked this dish' });
        }

        const updateSql = 'UPDATE DISHES SET dish_disblums = dish_disblums + 1 WHERE id = ?';
        db.query(updateSql, [dishID], (err, result) => {
            if (err) {
                console.error(`Failed to update dislikes for dish with ID ${dishID}:`, err);
                return res.status(500).send('Error updating dislikes');
            }

            const insertSql = `
                INSERT INTO USER_LIKES_DISLIKES (userID, id, disliked)
                VALUES (?, ?, 1)
                ON DUPLICATE KEY UPDATE disliked = 1, liked = NULL
            `;
            db.query(insertSql, [userID, dishID], (err, result) => {
                if (err) {
                    console.error(`Failed to update user dislikes for dish with ID ${dishID}:`, err);
                    return res.status(500).send('Error updating user dislikes');
                }
                res.json({ success: true, message: 'Dislike added successfully' });
            });
        });
    });
});
app.get('/api/dishes/:dishId/comment', (req, res) => {
    const { dishId } = req.params;
    const sql = `
        SELECT cd.comment_dishId, cd.userID, u.name, u.surname, u.profile_picture, cd.comment_text, cd.created_at 
        FROM COMMENT_DISH cd
        JOIN USERS u ON cd.userID = u.userID
        WHERE cd.id = ?
        ORDER BY cd.created_at DESC
    `;

    db.query(sql, [dishId], (err, results) => {
        if (err) {
            console.error(`Failed to retrieve comments for dish with ID ${dishId} from database:`, err);
            return res.status(500).send('Error fetching comments from the database');
        }
        res.json(results);
    });
});

app.post('/api/dishes/:dishId/comments', (req, res) => {
    const { dishId } = req.params;
    const { userID, comment_text } = req.body;

    const sql = `
        INSERT INTO COMMENT_DISH (userID, id, comment_text, created_at)
        VALUES (?, ?, ?, NOW())
    `;

    db.query(sql, [userID, dishId, comment_text], (err, result) => {
        if (err) {
            console.error(`Failed to post comment for dish with ID ${id}:`, err);
            return res.status(500).send('Error posting comment');
        }

        const newComment = {
            comment_dishId: result.insertId,
            userID,
            comment_text,
            created_at: new Date(),
        };

        res.json(newComment);
    });
});

app.get('/api/user/:userID/liked-dishes', (req, res) => {
    const { userID } = req.params;

    const sql = `
        SELECT d.id, d.title, d.image, d.countryFlag, d.dish_blums
        FROM DISHES d
        JOIN USER_LIKES_DISLIKES uld ON d.id = uld.id
        WHERE uld.userID = ? AND uld.liked = 1
    `;

    db.query(sql, [userID], (err, results) => {
        if (err) {
            console.error(`Failed to retrieve liked dishes for user with ID ${userID} from database:`, err);
            return res.status(500).send('Error fetching liked dishes from the database');
        }
        res.json(results);
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
    const query = `SELECT * FROM INGREDIENTS ORDER BY RAND()`;
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
    const validCategories = ['Epices', 'Legumes', 'Viande', 'Condiments', 'ProdEnConserves', 'Boissons', 'Autres']; // List of valid categories
    const category = req.params.category;

    // Check if the requested category is valid
    if (!validCategories.includes(category)) {
        return res.status(400).send('Invalid category');
    }

    const query = `SELECT * FROM INGREDIENTS WHERE category = ? ORDER BY RAND()`;
    db.query(query, [category], (err, results) => {
        if (err) {
            console.error(`Error fetching ${category}:`, err);
            return res.status(500).send(`Error fetching ${category} from the database`);
        }
        res.json(results);
    });
});

// Api to load all the dishes from the DISHES table.
app.get('/api/dish/:category', (req, res) => {
    const { category } = req.params;
    
    // Optionally, you could validate the category against a list of known categories
    const validCategories = ['Americans', 'Africans', 'Asians', 'Europeans'];
    if (!validCategories.includes(category)) {
        return res.status(400).send('Invalid category specified');
    }

    const query = `SELECT * FROM DISHES WHERE category = ? ORDER BY RAND()`;
    db.query(query, [category], (err, results) => {
        if (err) {
            console.error(`Error fetching ${category} dishes:`, err);
            return res.status(500).send(`Error fetching ${category} dishes from the database`);
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

// API to search for either a dish or an ingredient based on its category.
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

    const query = 'SELECT userID, name, surname, email, phone_number, postal_address, country_of_origin, profile_picture, password, role FROM USERS WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const user = results[0];

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
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
                profile_picture: user.profile_picture,
                role: user.role
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

        // Send registration confirmation email
        const mailOptions = {
            from: 'macroysimen@gmail.com', // Your email address
            to: email, // The user's email address
            subject: 'Bienvenue sur notre application !',
            text: `Bonjour ${name} ${surname},\n\nMerci de vous être inscrit sur notre application. Nous sommes ravis de vous avoir parmi nous !\n\nCordialement,\nL'équipe de l'application.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ error: 'Error sending registration email' });
            }
            console.log('Email sent:', info.response);
        });

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
    const query = 'SELECT name, surname, email, phone_number, postal_address, country_of_origin, profile_picture, password FROM USERS WHERE userID = ?';
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(results[0]);
    });
});

app.post('/api/users/:userID/update', async (req, res) => {
    const { userID } = req.params;
    const { name, surname, email, phone_number, postal_address, country_of_origin, profile_picture, current_password, new_password, password } = req.body;

    console.log('Received user data for update:', {
        userID, name, surname, email, phone_number, postal_address, country_of_origin, profile_picture, current_password, new_password
    });

    try {
        // If the current_password and new_password are provided, handle password update
        if (current_password && new_password) {
            // Fetch the user's current password from the database
            const [rows] = await db.promise().query('SELECT password FROM USERS WHERE userID = ?', [userID]);
            if (rows.length === 0) {
                return res.status(404).send('User not found');
            }

            const user = rows[0];
            const isMatch1 = await bcrypt.compare(current_password, user.password);
            const isMatch2 = await bcrypt.compare(new_password, user.password);
            if (!isMatch1) {
                return res.status(400).json({ success: false, message: 'Mot de passe courant est incorrect.' });
            }
            if (isMatch2){
                return res.status(400).json({ success: false, message: 'Les deux mot de passes doivent différer.' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(new_password, 10);

            // Update user details including the new hashed password
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
                    password = ?
                WHERE userID = ?
            `;

            await db.promise().query(sql, [name, surname, email, phone_number, postal_address, country_of_origin, profile_picture, hashedPassword, userID]);
        } else {
            // Update user details without password
            const sql = `
                UPDATE USERS
                SET
                    name = ?,
                    surname = ?,
                    email = ?,
                    phone_number = ?,
                    postal_address = ?,
                    country_of_origin = ?,
                    profile_picture = ?
                WHERE userID = ?
            `;

            await db.promise().query(sql, [name, surname, email, phone_number, postal_address, country_of_origin, profile_picture, userID]);
        }

        console.log('User updated successfully');
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Failed to update user:', err);
        res.status(500).send('Failed to update user');
    }
});
app.get('/api/receipts', (req, res) => {
    const { userID } = req.query; // Get userID from query parameters

    if (!userID) {
        return res.status(400).send({ error: 'User ID is required' });
    }

    const query = `
        SELECT 
            c.commandId, 
            c.commandDateTime, 
            c.paymentType, 
            c.amountDetails, 
            c.commandDetails,
            u.name AS userName, 
            u.surname AS userSurname, 
            u.phone_number AS userPhone, 
            u.email AS userEmail,
            m.memberID, 
            m.name AS memberName, 
            m.surname AS memberSurname
        FROM COMMANDS c
        JOIN USERS u ON c.userID = u.userID
        JOIN MEMBERS m ON c.memberID = m.memberID
        WHERE c.userID = ?
    `;

    db.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Failed to fetch receipts: ' + err);
            return res.status(500).send({ error: 'Failed to fetch receipts' });
        }
        res.json(results);
    });
});

app.post('/api/surveys', (req, res) => {
    const { userID, question1, question2, question3, question4, question5 } = req.body;
    const sql = `INSERT INTO SURVEYS (userID, surveyDate, question1, question2, question3, question4, question5) 
                 VALUES (?, NOW(), ?, ?, ?, ?, ?)`;

    db.query(sql, [userID, question1, question2, question3, question4, question5], (err, result) => {
        if (err) {
            console.error('Failed to insert survey:', err);
            res.status(500).json({ message: 'Failed to save survey' });
            return;
        }
        res.status(201).json({ message: 'Survey saved successfully' });
    });
});


app.post('/api/create-payment-intent', async (req, res) => {
    const { amount, name, surname, postalAddress, email, orderDetails, userID, memberID } = req.body;

    try {
        console.log('Received payment intent request:', {
            amount, name, surname, postalAddress, email, orderDetails, userID, memberID
        });

        let parsedOrderDetails = orderDetails;

        // Correctly calculate subtotal (in cents)
        const subtotalCents = parsedOrderDetails.reduce((acc, item) => acc + Math.round(parseFloat(item.price) * item.quantity * 100), 0);
        
        // Calculate delivery fee, taxes, and total based on the correct subtotal
        const deliveryFeeCents = Math.round(subtotalCents * 0.3);
        const taxTPSCents = Math.round(subtotalCents * 0.05);
        const taxTVQCents = Math.round(subtotalCents * 0.09975);
        const totalCents = subtotalCents + deliveryFeeCents + taxTPSCents + taxTVQCents;

        if (amount !== totalCents) {
            throw new Error('Mismatch between provided amount and calculated total');
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCents,
            currency: 'usd',
        });

        const clientSecret = paymentIntent.client_secret;
        console.log('Payment intent created, client secret:', clientSecret);

        // Extract only necessary fields from orderDetails
        const filteredOrderDetails = parsedOrderDetails.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            specifications: Array.isArray(item.specifications) ? item.specifications.map(spec => ({
                id: spec.id,
                title: spec.title,
                price: spec.price,
                quantity: spec.quantity
            })) : [] // Handle case where specifications might be undefined
        }));

        // Store receipt in the database
        const commandDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const paymentType = 'Card';
        const amountDetails = JSON.stringify({
            subtotal: (subtotalCents / 100).toFixed(2), 
            deliveryFee: (deliveryFeeCents / 100).toFixed(2),
            taxTPS: (taxTPSCents / 100).toFixed(2),
            taxTVQ: (taxTVQCents / 100).toFixed(2),
            total: (totalCents / 100).toFixed(2) 
        });
        const commandDetails = JSON.stringify(filteredOrderDetails);

        const query = `
            INSERT INTO COMMANDS (commandDateTime, paymentType, amountDetails, commandDetails, userID, memberID)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [commandDateTime, paymentType, amountDetails, commandDetails, userID, memberID], (err, result) => {
            if (err) {
                console.error('Error inserting receipt into database:', err);
                return res.status(500).send({ error: 'Failed to create receipt' });
            }

            const commandId = result.insertId;
            console.log('Receipt stored in database with command ID:', commandId);

            // Retrieve all members' emails and phone numbers
            db.query('SELECT email, phoneNumber FROM MEMBERS', (err, members) => {
                if (err) {
                    console.error('Error fetching members from database:', err);
                    return res.status(500).send({ error: 'Failed to fetch members' });
                }

                const emails = members.map(member => member.email);
                const phoneNumbers = members.map(member => member.phoneNumber);

                // Send email notifications
                const mailOptions = {
                    from: 'macroysimen@gmail.com',
                    bcc: emails, // Extract email addresses and use bcc to hide recipients
                    subject: 'Order Confirmation',
                    text: `Order received from ${name} ${surname}.\n\nAddress: ${postalAddress}\n\nOrder Details:\n${JSON.stringify(filteredOrderDetails, null, 2)}\n\nEmail: ${email}`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(400).send({ error: 'Failed to send confirmation email' });
                    }

                    console.log('Email sent:', info.response);

                    // Send SMS notifications
                    phoneNumbers.forEach(phoneNumber => {
                        twilioClient.messages.create({
                            body: `New order received from ${name} ${surname}. Check your email for details.`,
                            from: '8197018694',
                            to: phoneNumber
                        })
                        .then(message => console.log('SMS sent:', message.sid))
                        .catch(error => console.error('Error sending SMS:', error));
                    });

                    res.send({
                        success: 'Payment intent created, receipt stored, email sent, and SMS notifications sent successfully',
                        clientSecret,
                        commandId
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(400).send({ error: error.message });
    }
});


  // Endpoint to request a password reset
  app.post('/api/request-reset-password', async (req, res) => {
    const { contact } = req.body;
  
    if (!contact) {
        return res.status(400).json({ success: false, error: 'Email ou numéro de téléphone requis !' });
    }

    const resetCode = Math.floor(10000 + Math.random() * 90000).toString();
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour

    // Check if the contact is an email or phone number
    const isEmail = contact.includes('@');
    const query = isEmail ? 
        'UPDATE USERS SET resetCode = ?, resetTokenExpiration = ? WHERE email = ?' :
        'UPDATE USERS SET resetCode = ?, resetTokenExpiration = ? WHERE phone_number = ?';

    db.query(query, [resetCode, resetTokenExpiration, contact], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, error: 'Utilisateur non trouvé' });
        }

        if (isEmail) {
            sendResetCode(contact, resetCode); // Send reset code via email
        } else {
            sendResetCodeViaSMS(contact, resetCode); // Send reset code via SMS
        }

        res.json({ success: true, message: 'Code de réinitialisation envoyé' });
    });
});

  // Endpoint to verify the reset code
  app.post('/api/verify-reset-code', (req, res) => {
    const { contact, code } = req.body;

    if (!contact || !code) {
        return res.status(400).json({ success: false, error: 'Tous les champs sont réquis !' });
    }

    const query = 'SELECT resetCode, resetTokenExpiration FROM USERS WHERE (email = ? OR phone_number = ?) AND resetCode = ?';
    db.query(query, [contact, contact, code], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

        if (results.length === 0 || results[0].resetTokenExpiration < Date.now()) {
            return res.status(400).json({ success: false, error: 'Code invalide ou expiré' });
        }

        const token = jwt.sign({ contact }, 'your-secret-key', { expiresIn: '1h' });

        res.json({ success: true, token });
    });
});

  
  // Endpoint to reset password
  app.post('/api/reset-password', async (req, res) => {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, error: 'Les mots de passes ne correspondent pas' });
    }

    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        const email = decoded.email;

        const hashedPassword = await bcrypt.hash(password, 10);

        const updateQuery = 'UPDATE USERS SET password = ?, resetCode = NULL, resetTokenExpiration = NULL WHERE email = ?';
        db.query(updateQuery, [hashedPassword, email], (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, error: 'Internal Server Error' });
            }

            res.json({ success: true, message: 'Mot de passe modifié !' });
        });
    } catch (err) {
        console.error('JWT error:', err);
        return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }
});

const sendResetCode = (email, resetCode) => {
    const mailOptions = {
        from: 'macroysimen@gmail.com', // replace with your email
        to: email,
        subject: 'Reset your password',
        text: `Your password reset code is ${resetCode}.\n\nThis code will expire in one hour.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

app.post('/api/send-support-email', (req, res) => {
    const { subject, message, email } = req.body;

    const mailOptions = {
        from: email,
        to: 'macroysimen@gmail.com',
        subject: subject,
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send({ success: false, error: error.message });
        }
        res.send({ success: true });
    });
});

app.post('/api/add-member', (req, res) => {
    const { name, surname, phoneNumber, email, role, postalAddress, password } = req.body;

    // Validate the input
    if (!name || !surname || !phoneNumber || !email || !role || !postalAddress || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Insert the new member into the database
    const query = 'INSERT INTO MEMBERS (name, surname, phoneNumber, email, role, postalAddress, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, surname, phoneNumber, email, role, postalAddress, password], (err, result) => {
        if (err) {
            console.error('Error inserting member into database:', err);
            return res.status(500).json({ success: false, message: 'Failed to add member.' });
        }
        res.status(200).json({ success: true, message: 'Member added successfully.' });
    });
});

app.get('/api/members', (req, res) => {
    const query = 'SELECT email FROM MEMBERS WHERE memberID = 20000';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching members:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch members.' });
        }
        res.status(200).json({ success: true, members: results });
    });
});

app.get('/api/suppliers', (req, res) => {
    const sqlQuery = `SELECT supplierID, name, logo, openingTime, closingTime FROM suppliers`;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error fetching suppliers:', err);
            return res.status(500).send('Error fetching suppliers');
        }

        res.json({
            success: true,
            suppliers: results
        });
    });
});

app.get('/api/suppliers/:supplierID', (req, res) => {
    const { supplierID } = req.params;

    const supplierQuery = `SELECT * FROM suppliers WHERE supplierID = ?`;
    const ingredientsQuery = `
        SELECT i.id, i.title, i.image, i.category, i.price 
        FROM supplier_ingredient si
        JOIN INGREDIENTS i ON si.ingredientID = i.id
        WHERE si.supplierID = ?
    `;

    db.query(supplierQuery, [supplierID], (err, supplierResults) => {
        if (err) {
            console.error('Error fetching supplier:', err);
            return res.status(500).send('Error fetching supplier');
        }

        if (supplierResults.length === 0) {
            return res.status(404).send('Supplier not found');
        }

        db.query(ingredientsQuery, [supplierID], (err, ingredientResults) => {
            if (err) {
                console.error('Error fetching ingredients:', err);
                return res.status(500).send('Error fetching ingredients');
            }

            res.json({
                success: true,
                supplier: supplierResults[0],
                ingredients: ingredientResults
            });
        });
    });
});

app.get('/api/search/supplier_ingredients/:supplierID', (req, res) => {
    const { supplierID } = req.params;
    const searchTerm = req.query.query;

    console.log('Supplier ID:', supplierID);
    console.log('Search Term:', searchTerm);

    
    const query = `
        SELECT i.*
        FROM supplier_ingredient si
        JOIN INGREDIENTS i ON si.ingredientID = i.id
        WHERE si.supplierID = ? AND i.title LIKE ?
    `;
    
    db.query(query, [supplierID, `%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error(`Error searching ingredients for supplier ${supplierID}:`, err);
            return res.status(500).send(`Error searching ingredients for supplier ${supplierID}`);
        }
        res.json(results);
    });
});



// Directly specify server port
const port = 3006; // Replace with your desired port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
