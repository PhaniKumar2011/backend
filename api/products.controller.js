import ProductsDAO from "../dao/productsDao.js";
export default class ProductsController {
    static async apiGetProducts(req, res, next) {
      const productsPerPage = req.query.productsPerPage ? parseInt(req.query.productsPerPage, 10) : 20
      const page = req.query.page ? parseInt(req.query.page, 10) : 0
  
      let filters = {}
      if (req.query.price) {
        filters.price = req.query.price
      } 
      else if (req.query.code1) {
        filters.code1 = req.query.code1
      } 
      else if (req.query.productname) {
        filters.productname = req.query.productname
      }
  
      const { productsList, totalNumProducts } = await ProductsDAO.getproducts({
        filters,
        page,
        productsPerPage,
      })
  
      let response = {
        products: productsList,
        page: page,
        filters: filters,
        entries_per_page: productsPerPage,
        total_results: totalNumProducts,
      }
      res.json(response)
    }
   static async apiGetProductById(req, res, next) {
      try {
        let id = req.params.id || {}
        let product = await ProductsDAO.GetProductByID(id)
        if (!product) {
          res.status(404).json({ error: "Not found" })
          return
        }
        res.json(product)
      } catch (e) {
        console.log(`api, ${e}`)
        res.status(500).json({ error: e })
      }
    }
  
  
}