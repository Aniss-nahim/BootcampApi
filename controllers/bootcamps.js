const path = require('path');
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
    // Get query from previous middleware
    let { query } = res.locals;

    // Populate with courses
    query = query.populate('courses');
    const total = await Bootcamp.countDocuments();

    if(!req.query.paginate || JSON.parse(req.query.paginate) === false){
        const data = await query;
        return res.status(200).json({success : true, count: total, data});
    }

    res.locals = { query, total };
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

/**
 * @desc Upload photo for bootcamp
 * @route POST api/v1/bootcamps/:id/photo
 * @access Private
 */
exports.uploadBootcampPhoto = asyncHandler( async (req, res, next)=>{
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(ErrorApi.NotFound());
    }
    
    if(!req.files){
        return next(ErrorApi.BadRequest('Please upload an image'));
    }

    const { file } = req.files;
    const fileType = file.mimetype.split('/')[0];

    // the file is an image
    if(fileType !== 'image'){
        return next(ErrorApi.BadRequest('The file should be an image'));
    }

    // Image size allowed
    if(file.size > process.env.IMAGE_MAX_SIZE){
        const maxSize = Math.ceil(process.env.IMAGE_MAX_SIZE / 1048576);
        return next(ErrorApi.BadRequest(`Please upload an image with maximum size of ${maxSize}Mo`));
    }
   
    // Create custom file.name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    // Move the image to the storage folder
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if(err){
            return next(ErrorApi.Internal());
        }

        await bootcamp.update({ photo : file.name });
        bootcamp.photo = file.name;

        res.status(200).json({ success : true, data: bootcamp });
    });
})