/**
 * @desc Get all bootcomps
 * @route GET api/v1/bootcomps
 * @access Public
 */
exports.getBootcomps = (req, res, next)=>{
    res
     .status(200)
     .json({ success : true, msg: "Show all bootcomps"});
}

 /**
 * @desc Get signle bootcomp
 * @route GET api/v1/bootcomps/:id
 * @access Public
 */
exports.getBootcomp = (req, res, next)=>{
    res
     .status(200)
     .json({ success : true, msg: `Show bootcomp with id ${req.params.id}`});
}

 /**
 * @desc Create new bootcomp
 * @route POST api/v1/bootcomps
 * @access Public
 */
exports.createBootcomp = (req, res, next)=>{
    res
    .status(201)
    .json({ success : true, msg: "Create bootcomp"});
}

/**
 * @desc Update a bootcomp
 * @route PUT api/v1/bootcomps/:id
 * @access Public
 */
exports.updateBootcomp = (req, res, next)=>{
    res
    .status(200)
    .json({ success : true, msg: `Update bootcomp with id ${req.params.id}`});
}

 /**
 * @desc Delete a bootcomp
 * @route DELETE api/v1/bootcomps/:id
 * @access Public
 */
exports.deleteBootcomp = (req, res, next)=>{
    res
     .status(200)
     .json({ success : true, msg: `Delete bootcomp with id ${req.params.id}`});
}
