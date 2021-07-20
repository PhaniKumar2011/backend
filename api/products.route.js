import express from "express"
/* import ProductsDAO from "../dao/productsDao" */
import ProductsController from "./products.controller.js"
import ReviewsController from "./reviews.controller.js"

const router = express.Router()

router.route("/").get(ProductsController.apiGetProducts)
router.route("/id/:id").get(ProductsController.apiGetProductById)


router
  .route("/review")
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview)
  .delete(ReviewsController.apiDeleteReview)

export default router