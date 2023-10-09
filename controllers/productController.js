const Product = require('../models/Product');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const fs = require('fs');
const path = require('path');

const createProduct = async (req,res) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({product});
}
const getAllProducts = async (req,res) => {
    const products = await Product.find({});

    res.status(StatusCodes.OK).json({ products, count: products.length });
}
const getSingleProduct = async (req,res) => {
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }

    res.status(StatusCodes.OK).json({ product });
}
const updateProduct = async (req,res) => {
    const { id: productId } = req.params;

    const product = await Product.findOneAndUpdate(
      { _id: productId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }

    res.status(StatusCodes.OK).json({ product });
}
const deleteProduct = async (req,res) => {
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }

    await product.remove();
    res.status(StatusCodes.OK).json({ msg: "Success! Product removed." });
}
const uploadImage = async (req,res) => {
  if(!req.files){
    throw new CustomError.BadRequestError('That is no image')
  }
  if(!req.files.image.mimetype.startsWith('image')){
    throw new CustomError.BadRequestError("That is no image");
  }
  const maxSize = 1024 * 700;
  if(req.files.image.size > maxSize){
    throw new CustomError.BadRequestError("provided image is too big");
  }
  const imagePath = path.join(__dirname,'../public/uploads/' + `${req.files.image.name}`)
  await req.files.image.mv(imagePath);
  res.status(StatusCodes.OK).json({image:`/uploads/${req.files.image.name}`})
}

module.exports = {createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct,uploadImage};