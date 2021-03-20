/**
 * Course Seeder class
 */
const Seeder = require('./Seeder');
const Course = require('../../models/Course');

class CourseSeeder extends Seeder{
    static resource = `${__dirname}/../../_data/courses.json`;
    constructor(){
        super();
        this.model = Course;
    }

    static import(){
        const Courses = this.read(this.resource);
        (new CourseSeeder).create(Courses);
    }

    static clear(){
        (new CourseSeeder).delete();
    }
}

module.exports = CourseSeeder;