const Joi = require('joi');
const express = require('express');
const app = express();

// return a middle ware, and use it in express pipeline
app.use(express.json());

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'}
];

// (url, callback())
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    //dont want to reset the course later, so usej const
    const course = courses.find(c => c.id === parseInt(req.params.id));
    //return 404 code if not found
    if(!course) return res.status(404).send('The course with the given ID was not found');
    res.send(course);
});

// add new
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

//update
app.put('/api/courses/:id', (req, res) => {
    // look up the course
    // if not exist, reutnr 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found');
    // validate course
    // if invalide, return 404
    console.log(req.body);
    const { error } = validateCourse(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // update course
    course.name = req.body.name;
    // return updated courses
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found');
    
    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // return the same course
    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));