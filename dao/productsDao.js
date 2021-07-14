import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let products

export default class ProductsDAO {
  static async injectDB(conn) {
    if (products) {
      return
    }
    try {
      products = await conn.db(process.env.PRODUCT_NS).collection("products")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in productsDAO: ${e}`,
      )
    }
  }

  static async getproducts({
    filters = null,
    page = 0,
    productsPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } }
      } else if ("cuisine" in filters) {
        query = { "cuisine": { $eq: filters["cuisine"] } }
      } else if ("discount-price" in filters) {
        query = { "discount-price": { $eq: filters["discount-price"] } }
      }
    }

    let cursor
    
    try {
      cursor = await products
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { productsList: [], totalNumproducts: 0 }
    }

    const displayCursor = cursor.limit(productsPerPage).skip(productsPerPage * page)

    try {
      const productsList = await displayCursor.toArray()
      const totalNumproducts = await products.countDocuments(query)

      return { productsList, totalNumproducts }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { productsList: [], totalNumproducts: 0 }
    }
  }
 /*  static async getRestaurantByID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "reviews",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$restaurant_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "reviews",
                  },
              },
              {
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]
      return await products.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getRestaurantByID: ${e}`)
      throw e
    }
  }

  static async getCuisines() {
    let cuisines = []
    try {
      cuisines = await products.distinct("cuisine")
      return cuisines
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`)
      return cuisines
    }
  } */
}

