//require modules
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

//models
const Worker = require('./models/worker.model');
const Mineral = require('./models/mineral.model');
const Company = require('./models/company.model');
const Mine = require('./models/mine.model');
const Work_hour = require('./models/work_hour.model');
const Mineral_mine = require('./models/mineral_mine.model');

const connectDB = async () =>
{
    try
    {
        await mongoose.connect(process.env.DB_ATLAS_URL);
        console.log("connected to DB");
    }
    catch (err)
    {
        console.error(err);
    }
}

connectDB();

var num = 3;

const worker = [];
const mineral = [];
const company = [];
const mine = [];
const work_hour = [];
const mineral_mine = [];

const gernerate = (num) =>
{
    for (let i = 0; i < num; i++)
    {        
        var full_name = faker.person.firstName();
        var description = faker.lorem.sentences(1);
        var email = faker.internet.email();
        var password = "password"
        var phone = faker.number.int();

        worker.push(
        {
            full_name,
            description,
            email,
            password,
            phone
        });

        var name = faker.person.firstName();
        description = faker.lorem.sentences(1);

        mineral.push(
        {
            name,
            description,
        });

        name = faker.person.firstName();
        description = faker.lorem.sentences(1);
        var ceo_email = email
            
        company.push(
        {
            name,
            description,
            ceo_email
        });

        var company_name = name
        name = faker.person.firstName(),
        latitude = faker.number.int(),
        longitude = faker.number.int(),
        manager_email = email

        mine.push(
        {
            company_name,
            name,
            latitude,
            longitude,
            manager_email,
        });
    }

    return worker, mineral;
}

async function seedData() 
{
    // Connection URL
    const uri = process.env.DB_ATLAS_URL;
    const seed_count = 5000;

    mongoose.set("strictQuery", false);
    mongoose.connect(uri, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => 
    {
        console.log("Connected to db")
    })
    .catch((err) => 
    {
        console.log("error", err)
    })

    gernerate(num);

    const seedDB = async () => 
    {
        await Mineral_mine.collection.drop()
        await Work_hour.collection.drop()
        await Mine.collection.drop()
        await Company.collection.drop()
        await Mineral.collection.drop()
        await Worker.collection.drop()

        await Worker.insertMany(worker)
        await Mineral.insertMany(mineral)
        await Company.insertMany(company)
        await Mine.insertMany(mine)
    }

    seedDB().then(() => 
    {
        mongoose.connection.close()
        console.log("seed success")
    })
}

seedData()
