const ErrorResponse = require('../utils/errorResponse');
const asyncHandler=require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc get all
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req,res,next)=>{
    let query;

    const reqQuery={...req.query};

    const removeFields=['select','sort','page','limit'];

    removeFields.forEach(param => delete reqQuery[param]);
    
    let queryStr=JSON.stringify(reqQuery);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`);
    query=Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    //select field
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query=query.select(fields);   
    }
    //sort
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    }else{
        query=query.sort('-createdAt');
    }
    //pagination
    const page=parseInt(req.query.page,10) || 1;
    const limit=parseInt(req.query.limit,10) || 25;
    
    const startIndex=(page-1) * limit;
    const endIndex=page*limit;
    const total= await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);
    
    const bootcamps = await query;  
    // Paginatin result
    const pagination={};
    if(endIndex < total){
        pagination.next={
            page:page+1,
            limit
        }
    }
    if(startIndex > 0){
        pagination.prev={
            page:page-1,
            limit
        }
    }
    res.status(200).json({success:true,count:bootcamps.length,pagination,data:bootcamps});    
});

// @desc single
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req,res,next)=>{
    
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        res.status(200).json({success:true,data:bootcamp})
    
});
// @desc create
// @route post /api/v1/bootcamps
// @access private
exports.createBootcamp = asyncHandler(async (req,res,next)=>{
    
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success:true,
            data:bootcamp
        })
    
    
});
// @desc update
// @route put /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req,res,next)=>{
    
        const bootcamp= await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)
            );
            // return res.status(400).json({success:flase});
        }
        res.status(200).json({success:true,data:bootcamp});
    
    
});
// @desc delete
// @route delete /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req,res,next)=>{
   
        const bootcamp= await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)
            );
        }
        bootcamp.remove();
        res.status(200).json({success:true,data:{}});
    
});

// @desc   get bootcamps within a radius
// @route  get /api/v1/bootcamps/radius/:zipcode/:distance
// @access private
exports.getBootcampsInRadius = asyncHandler(async (req,res,next)=>{
   const {zipcode,distance}=req.params;
   

   // Get lat/lng geocoder
   const loc=await geocoder.geocode(zipcode);
   
   const lat=loc[0].latitude;
   const lng=loc[0].longitude;

   // calc radius using radiuns
   // divide dist by radius of earth
   //earth radius=3.963mi / 6,378 km
   const radius = distance / 3963;
   
   const bootcamps = await Bootcamp.find({
       location:{ $geoWithin: {$centerSphere:[[lng,lat],radius]}}
    });
    console.log(lng,lat,radius);
   res.status(200).json({
       success:true,
       count:bootcamps.length,
       data:bootcamps
   });
});