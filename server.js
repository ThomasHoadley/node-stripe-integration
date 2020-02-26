if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

const express = require("express")
const app = express()
const fs = require("fs")
const stripe = require("stripe")(stripeSecretKey)

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.static("public"))

app.get("/", (req, res) => {
  fs.readFile("items.json", (error, data) => {
    if (error) {
      res.status(500).end()
    } else {
      res.render("index.ejs", {
        stripePublicKey: stripePublicKey,
        items: JSON.parse(data)
      })
    }
  })
})

app.post("/purchase", (req, res) => {
  fs.readFile("items.json", (error, data) => {
    if (error) {
      res.status(500).end()
    } else {
      let total = 0
      const serverItems = JSON.parse(data)
      const productId = req.body.productId
      serverItems.products.find((item, index) => {
        if (item.id == productId) {
          const journalCost = serverItems.products[index].journalCost
          total = total + journalCost * 100
          return
        }
      })
      stripe.charges
        .create({
          amount: total,
          source: req.body.stripeTokenId,
          currency: "gbp"
        })
        .then(() => {
          console.log("charge successful")
          res.json({ message: "succesfully purchased items" })
          // this is where you would want to redirect them to the home screen so they could add more shit
        })
        .catch(error => {
          console.log("charge failed")
          console.log(error)
          res.status(500).end()
        })
    }
  })
})

app.listen(3000)
