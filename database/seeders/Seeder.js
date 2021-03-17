/**
 * Seeder Class extended by all Seeders
 */
const fs = require('fs');

class Seeder{

    static read(resource){
        return JSON.parse(
            fs.readFileSync(resource, 'utf-8')
        );
    }
    
    // create Method
    async create(data){
        try{
            await this.model.create(data);
            console.log('Data imported successfully'.green.inverse);
            process.exit();
        }catch(err){
            console.error(err);
        }
    }

    // create Method
    async delete(){
        try{
            await this.model.deleteMany();
            console.log('Data deleted successfully'.red.inverse);
            process.exit();
        }catch(err){
            console.error(err);
        }
    }
}

module.exports = Seeder;