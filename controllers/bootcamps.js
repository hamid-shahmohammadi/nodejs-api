const ErrorResponse = require('../utils/errorResponse');
const asyncHandler=require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

// @desc get all
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req,res,next)=>{
    
       const bootcamps = await Bootcamp.find();  
       res.status(200).json({success:true,count:bootcamps.length,data:bootcamps});   
  
    
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
   
        const bootcamp= await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)
            );
            
            // return res.status(400).json({success:flase});
        }
        res.status(200).json({success:true,data:{}});
    
});