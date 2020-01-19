const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {
        id:1,
        teacherName:"Anderi Neagoie",
        courseName:"The Complete Web Dev"
    },
    {
        id:2,
        teacherName:"Hitesh Choudhary",
        courseName:"React Native Bootcamp"
    },{
        id:3,
        teacherName:"Saurabh Shukla",
        courseName:"Data Structure and Algorithm"
    }
];

app.get('/',(req, res)=>{
    res.send('hello world');
});

app.get('/api/courses',(req, res)=>{
    res.send(courses);
});

app.get('/api/courses/:id/:teacherName',(req, res)=>{
    const course = courses.filter(course=>{
        return course.id === parseInt(req.params.id) && course.teacherName===req.params.teacherName;
    })
    if(course.length===0) {
        res.send('Not a valid course');
    } else {
        res.status(200).send(course);
    }
});

app.post('/api/courses',(req, res)=>{
    const schema = Joi.object().keys({
        teacherName:Joi.string().min(4).required(),
        courseName:Joi.string().min(6).required()
    });
    const result = Joi.validate({ teacherName: req.body.teacherName, courseName: req.body.courseName }, schema);
    console.log(result);
    if(result.error===null){
        const course = {
            id:courses.length+1,
            teacherName:result.value.teacherName,
            courseName:result.value.courseName
        }

        courses.push(course);
        res.send(course);
    } else {
        res.status(400).send(result.error.details[0].message);
    }
});

app.put('/api/courses/:id',(req, res)=>{
    let course = courses.filter(course=>{
        return course.id === parseInt(req.params.id);
    })
    console.log(course);
    if(course.length===0) {
        res.send('Not a valid course');
        return;
    }
    const schema = Joi.object().keys({
        teacherName:Joi.string().min(4).required(),
        courseName:Joi.string().min(6).required()
    });
    const result = Joi.validate(req.body, schema);
    console.log(result);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    course.teacherName= req.body;
    course.courseName = req.body;
    res.status(200).send(course);
})

app.delete('/api/courses/:id',(req, res)=>{
    const course =  courses.find(course=>{
    return course.id===parseInt(req.params.id)
    });
    if(!course) {
        res.status(400).send('Not a valid course')
        return;
    }
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(courses);
    
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listening on port ${port}....`)
});

