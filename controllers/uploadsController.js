const path = require('path')
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadProductImageLocal = async (req, res) => {

    console.log(req.files);
    if(!req.files){
        throw new CustomError.BadRequestError('No File Uploaded');
    }
    const productImage =req.files.image;
    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('Please Upload Image');
    }

    const maxSize = 1024 * 1024 *1024;

    if(productImage.size > maxSize){
        throw new CustomError.BadRequestError('Please upload Image smaller');
    }

    const imagePath = path.join(__dirname, '../public/uploads/'+`${productImage.name}`);
    console.log(imagePath)
    await productImage.mv(imagePath);


    res.status(StatusCodes.OK).json({image:{src:`/uploads/${productImage.name}`}});
}

const uploadProductImage = async (req, res) => {
  
    //We send image file to cloudinary server
        const result = await cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            {
            use_filename: true,
            folder: 'file-upload'
    
        });//we adding tempFilePath white de fileUpload middleware

    //we clean the tmp folder when we have finished to upload the image to cloudinary
    fs.unlinkSync(req.files.image.tempFilePath)
    return res.status(StatusCodes.OK).json({image:{src:result.secure_url}});
}


module.exports = {uploadProductImage}