const express = require("express");
const router = express.Router();
const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  uploadImage
} = require("../controllers/productController");
const {
  authorizePermissions,
  authenticateUser,
} = require("../middleware/authentication");

const {getSingleProductReview} = require('../controllers/reviewController')

router.route('/').post([authenticateUser,authorizePermissions('admin')],createProduct).get(getAllProducts)
router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions("admin")], updateProduct)
  .delete([authenticateUser, authorizePermissions("admin")],deleteProduct);
router.route('/uploadImage').post([authenticateUser, authorizePermissions("admin")],uploadImage)  
router.route('/:id/review').get(getSingleProductReview);

module.exports = router
