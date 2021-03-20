const Bootcamp = require('../models/Bootcamp');
const ErrorApi = require('../error/ErrorApi');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');

/**
 * @desc Get all bootcamps
 * @route GET api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps =asyncHandler( async (req, res, next)=>{
    // copy req.query
    const reqQuery = { ...req.query };

    // Ignored fields
    const ignoredFields = ['select', 'sort', 'page', 'limit', 'paginate'];
    
    // delete the exculded fields from the reqQuery
    ignoredFields.forEach( field => delete reqQuery[field]);

    // create String query
    let queryString = JSON.stringify(reqQuery);
    queryString = queryString.replace(/\b(g|l)te?|in\b/g, match => `$${match}`);
    let  query = Bootcamp.find(JSON.parse(queryString)).populate('courses');
    
    // select fields
    if(req.query.select){
        // get formated string
        const fields = req.query.select.split(',').join(' ');
        query.select(fields);
    }

    // sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');
    }

    //Pagination
    const limit = Math.abs(parseInt(req.query.limit, 10)) || 25;
    const page = Math.abs(parseInt(req.query.page, 10)) || 1;
    const start = (page - 1) * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(start).limit(limit);

    // Execute query
    const bootcamps = await query;

    // passing params in req to next middleware
    req.paginate = {
        limit,
        page,
        total ,
        data : bootcamps
    }

    next();
})

 /**
 * @desc Get signle bootcamp
 * @route GET api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = asyncHandler( async (req, res, next)=>{
    
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(ErrorApi.NotFound());
    }

    res.status(200)
    .json({ success : true, data: bootcamp});
})

 /**
 * @desc Create new bootcamp
 * @route POST api/v1/bootcamps
 * @access Private
 */
exports.createBootcamp = asyncHandler( async (req, res, next)=>{
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201)
    .json({ success : true, data : bootcamp});
})

/**
 * @desc Update a bootcamp
 * @route PUT api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = asyncHandler( async (req, res, next)=>{

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    });
    
    if(!bootcamp){
        return next(ErrorApi.NotFound());
    }
    res.status(200).json({ success : true, data: bootcamp});
})

 /**
 * @desc Delete a bootcamp
 * @route DELETE api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = asyncHandler( async (req, res, next)=>{
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(ErrorApi.NotFound());
    }
    // trigger mongoose middleware then remove 
    await bootcamp.remove();

    res.status(204).json({ success : true, message : "Bootcamp deleted" });
})

 /**
 * @desc Get bootcamps with in a radius
 * @route GET api/v1/bootcamps/radius/:zipcode/:distance/:unit([km,mi])?
 * @access Public
 */
exports.getBootcampInRadius = asyncHandler( async (req, res, next)=>{
    const {zipcode, distance, unit} = req.params;
    console.log(unit);
    // Get lat/lang giving a zipcode
    const centerLocation = await geocoder.geocode(zipcode);

    // calculate the angular distance (radius) between the centerLocation
    // and all points move away by a distance :distance from this center
    // Knowing that Earth radius =  6378 km or 3963 mi
    let earthRadius = 6378;
    if(unit === 'mi'){
        earthRadius = 3963;
    }
    const radius =  distance / earthRadius;
    // Query results
    const bootcamps = await Bootcamp.find({
        location : {$geoWithin: { $centerSphere: [ [ centerLocation[0].longitude, centerLocation[0].latitude ], radius ]}}
    });

    res.status(200).json({ success : true, count : bootcamps.length, data: bootcamps});
})