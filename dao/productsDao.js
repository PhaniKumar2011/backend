import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let products

export default class ProductsDAO {
  static async injectDB(conn) {
    if (products) {
      return
    }
    try {
      products = await conn.db(process.env.PRODUCT_NS).collection("products_list")
    } 
    catch (e) 
    {
      console.error(`Unable to establish a collection handle in productsDAO: ${e}`)
    }
  }

  static async getproducts({
    filters = null,
    page = 0,
    productsPerPage = 10,
  } = {}) {

    let query
    if (filters){
      if("productname" in filters){
          query = {$text : {$search : filters["productname"]}}
      }
      else if ("price" in filters) {
          query = { "price": { $eq: filters["price"] } }
      } 
      else if ("code1" in filters) {
          query = { "code1": { $eq: filters["code1"] } }
      }
    }

    let cursor
    
    try {
      cursor = await products.find(query)
    } 
    catch (e) 
    {
      console.error(`Unable to issue find command, ${e}`)
      return { productsList: [], totalNumproducts: 0 }
    }

    const displayCursor = cursor.limit(productsPerPage).skip(productsPerPage * page)

    try {
      const productsList = await displayCursor.toArray()
      const totalNumproducts = await products.countDocuments(query)

      return { productsList, totalNumproducts }
    } 
    catch (e) 
    {
      console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
      return { productsList: [], totalNumproducts: 0 }
    }
  }
  static async GetProductsById(id) {
    try{
      const pipeline=[
          {
      $match: {
          _id: new ObjectId(id),
      },
      },
      {$lookup: {from:"reviews",
          let:{
              id:"$_id"
          },
          pipeline: [{
              $match :{
                  $expr:{
                      $eq: ["$product_id","$$id"],
                  },
              },
          },
          {
              $sort: {
                  date: -1,
              },
          },
      ],
      as:"reviews",
      },
      },
  {
      $addFields: {
          reviews:"$reviews",
      },
  },
  ]
  return await products.aggregate(pipeline).next()
  }
     catch (e) {
      console.error(`Something went wrong in GetProductsById: ${e}`)
      throw e
    }
  } 

   static async getCategories(){
    let categories=[]
    try{
        categories = await products.distinct("category")
        return categories
    }
    catch(e){
        console.error(`unable to get categories :${e}`)
        return categories
    }
} 
}

