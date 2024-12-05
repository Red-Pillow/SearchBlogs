const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Sample blog data
const blogs = [
    { id: 1, title: "Learn Node.js", content: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine...", category: "Programming" },
    { id: 2, title: "Express Basics", content: "Express.js is a web application framework for Node.js, designed to make building web apps easier...", category: "Programming" },
    { id: 3, title: "Healthy Living", content: "Adopting a healthy lifestyle is crucial for overall well-being. Regular exercise and balanced diet are key...", category: "Health" },
    { id: 4, title: "Travel the World", content: "Exploring new cultures and countries is a life-changing experience. Here are some amazing destinations to visit...", category: "Travel" },
    { id: 5, title: "JavaScript Tips", content: "Mastering JavaScript requires understanding of core concepts such as closures, promises, and async/await...", category: "Programming" },
    { id: 6, title: "Mindful Meditation", content: "Meditation can improve focus and mental clarity. Here's how to start a meditation practice...", category: "Health" },
    { id: 7, title: "Top 10 Travel Destinations", content: "From the beaches of Bali to the historical landmarks in Rome, discover the world's top travel destinations...", category: "Travel" },
    { id: 8, title: "CSS Flexbox Explained", content: "Flexbox is a layout model that makes it easy to create responsive and flexible layouts...", category: "Programming" },
    { id: 9, title: "Building REST APIs with Node.js", content: "Learn how to design and build robust REST APIs using Node.js and Express.js...", category: "Programming" },
    { id: 10, title: "Yoga for Beginners", content: "Yoga is a fantastic way to improve flexibility, strength, and mental clarity. Here's a guide for beginners...", category: "Health" },
    { id: 11, title: "Traveling on a Budget", content: "Discover tips and tricks to travel the world without breaking the bank. Budget travel is possible with the right strategy...", category: "Travel" },
    { id: 12, title: "Python Programming for Beginners", content: "Python is a great programming language for beginners. Here's an introduction to Python basics...", category: "Programming" },
    { id: 13, title: "The Importance of Sleep", content: "Quality sleep is essential for mental and physical health. Learn about sleep hygiene and tips for better rest...", category: "Health" },
    { id: 14, title: "React.js Fundamentals", content: "React.js is one of the most popular JavaScript libraries. Learn about components, JSX, and state management in React...", category: "Programming" },
    { id: 15, title: "Solo Travel Adventures", content: "Traveling alone can be a life-changing experience. Here are the pros and cons of solo travel...", category: "Travel" },
    { id: 16, title: "Understanding Asynchronous JavaScript", content: "Asynchronous programming is a crucial concept in JavaScript. Here's a guide to promises, async/await, and callbacks...", category: "Programming" },
    { id: 17, title: "Nutrition for Mental Health", content: "A healthy diet not only affects your physical health but also your mental well-being. Learn about foods that support mental health...", category: "Health" },
    { id: 18, title: "Travel Hacks for Frequent Flyers", content: "Maximize your travel experience with these tips for frequent flyers. Learn about loyalty programs, packing hacks, and more...", category: "Travel" },
    { id: 19, title: "Introduction to MongoDB", content: "MongoDB is a NoSQL database that stores data in JSON-like format. Learn how to set up and use MongoDB in your projects...", category: "Programming" },
    { id: 20, title: "The Benefits of Outdoor Activities", content: "Spending time outdoors can boost mental health, reduce stress, and improve physical fitness. Here's why you should spend more time outdoors...", category: "Health" }
];


// Home Page
app.get('/', (req, res) => {
    res.render('index', { blogs: blogs });
});

// Search Results
app.post('/search', (req, res) => {
    const query = req.body.query.toLowerCase();
    const category = req.body.category;

    const filteredBlogs = blogs.filter(blog => {
        const matchesQuery = blog.title.toLowerCase().includes(query) || blog.content.toLowerCase().includes(query);
        const matchesCategory = category === "All" || blog.category === category;
        return matchesQuery && matchesCategory;
    });

    res.render('results', { blogs: filteredBlogs, query, category });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
