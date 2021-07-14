import express from "express"
/* import ProductsDAO from "../dao/productsDao" */
import ProductsCtrl from "./products.controller.js"

const router = express.Router()

router.route("/").get(ProductsCtrl.apiGetProducts)

export default router