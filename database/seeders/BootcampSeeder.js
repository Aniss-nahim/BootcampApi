/**
 * Bootcamp Seeder class
 */
const Seeder = require('./Seeder');
const Bootcamp = require('../../models/Bootcamp');
const CourseSeeder = require('./CourseSeeder');

class BootcampSeeder extends Seeder{
    static resource = `${__dirname}/../../_data/bootcamps.json`;
    constructor(){
        super();
        this.model = Bootcamp;
    }

    static import(){
        const bootcamps = this.read(this.resource);
        (new BootcampSeeder).create(bootcamps);
    }

    static clear(){
        (new CourseSeeder).delete();
        (new BootcampSeeder).delete();
    }
}

module.exports = BootcampSeeder;