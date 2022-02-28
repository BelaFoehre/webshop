require("./config/database").connect();


const Inventory = require("./model/inventory")

async function add(){
    try {
        await Inventory.create(
            {
                name: "Flexus Shirtus",
                brand: "ch3fs4ch3",
              
                kategories: ["shirt"],
                sizes: [
                    { size: "s", price: 21, qty: 21 },
                    { size: "m", price: 42, qty: 420 },
                    { size: "l", price: 69, qty: 13 },
                ],
                tags: ["cotton"],
              }
        )
    } catch (error) {
        console.log(error)
    }
}

add()
