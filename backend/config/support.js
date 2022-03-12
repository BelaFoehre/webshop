const Inventory = require("../model/Inventory")

exports.getProductById = async (searchId) => {
    // const prod = await Inventory.findOne({_id: searchId})
    let prod
    await Inventory.findById(searchId).then((res) => {
        prod = res
    }).catch((err) => {})

    return prod
}

exports.updateInventory = (product, qtyChange) => {
    product.availableQty += qtyChange

    return new Promise((resolve, reject) => {
        product.save((err, data) => {
            if(err) reject(err)
            else resolve()
        })
    })
}