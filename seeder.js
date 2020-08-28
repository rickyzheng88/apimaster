const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// load dotenv
dotenv.config({ path: "./config/config.env" });

// connect to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
});

// load model
const bootcamp = require('./models/bootcampModel');
const course = require('./models/courseModel');
const user = require('./models/userModel');
const reviewModel = require('./models/reviewModel');

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));

// Import into Database
const importData = async () => {
    console.log("Importing Data, please wait a minute...".blue);
    try {
        // create users then get only those who are admins and publishers
        await user.create(users);
        const authorizedUsers = await user.find().or([{ role: 'admin' }, { role: 'publisher' }]);
        const admin = await user.findOne({ email: 'ricky@gmail.com' });
        
        // Add users-id to bootcamps user field
        const reformedBootcamps = bootcamps.map((value, index) => {
            value.user = authorizedUsers[index].id;
            return value;
        });
        await bootcamp.create(reformedBootcamps);

        const boots = await bootcamp.find();

        // add bootcamps-id and User-id to the respective Courses fields
        const reformedCourses = courses.map((value, index) => {
            // if there is more courses than bootcamp, then asign the first bootcamp as default
            if (boots[index]) {
                value.bootcamp = boots[index].id;
                value.user = boots[index].user;
            } else {
                value.bootcamp = boots[0].id;
                value.user = admin.id;
            }

            return value;
        });
        // Create Courses
        await course.create(reformedCourses);

        // Get user and admin roles users
        const usersAndAdmins = await user.find().or([{ role: 'admin' }, { role: 'user' }]);

        // Add bootcamps-Id and users-id in the reviews
        const reformedReviews = reviews.map((value, index) => {
            value.user = usersAndAdmins[index] ? usersAndAdmins[index].id : admin.id;
            value.bootcamp = boots[index] ? boots[index].id : boots[0].id;

            return value;
        });
        // create Reviews
        await reviewModel.create(reformedReviews);

        console.log("Data imported!".green);
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

const deleteData = async () => {
    console.log("Deleting Data, please wait a minute...".blue);
    try {
        await bootcamp.deleteMany();
        await course.deleteMany();
        await user.deleteMany();

        console.log("Data Deleted!".red);
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}