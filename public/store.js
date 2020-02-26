var stripeHandler = StripeCheckout.configure({
  key: stripePublicKey,
  local: "en",
  token: token => {
    var priceElement = document.getElementsByClassName("cart-total-price")[0]
    var productId = priceElement.dataset.id

    fetch("/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        stripeTokenId: token.id,
        productId: productId
      })
    })
      .then(function(res) {
        return res.json()
      })
      .then(data => {
        alert(data.message)
        // redirect to purchase page.
        // add a purchased item to their user.
      })
      .catch(error => {
        console.error(error)
      })
  }
})

function purchaseClicked(element) {
  var priceElement = document.getElementsByClassName("cart-total-price")[0]
  var productId = element.target.dataset.id
  var price = parseFloat(priceElement.innerText.replace("£", "")) * 100
  stripeHandler.open({
    amount: price,
    productId: productId
  })
}

document
  .getElementsByClassName("purchaseAccess")[0]
  .addEventListener("click", function(element) {
    purchaseClicked(element)
  })
