var express = require("express");
var router = express.Router();
var braintree = require("braintree");

require("dotenv").config();

router.post("/", function (req, res, next) {

  /*		=Set up gateway
    ---------------------------------------- */
  
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
  });
  
  /*		=Form data
    ---------------------------------------- */
  
  var form = req.body.formData

  var clientData = {
    
    // Core
    nonce: form["payment-method-nonce"],

    // Basic user info
    firstName: form["first-name"],
    surname: form["surname"],
    email: form["email-address"],
    
    // Billing
    billingStreetAddress: form["billing-street-address"],
    billingPostalCode: form["billing-postal-code"],

    // Shipping
    shippingStreetAddress: form["shipping-street-address"],
    shippingTown: form["shipping-town"],
    shippingRegion: form["shipping-region"],
    shippingPostalCode: form["shipping-postal-code"],
    shippingCountry: form["shipping-country"],

    // Product info
    productName: form["product-name"],
    productID: form["product-id"],
    productPrice: form["product-price"],
    productQty: form["product-qty"],
    productTotal: form["product-total"]
  }

  /*		=Sale options
    ---------------------------------------- */
  
  var saleOpts = {
    
    // Payment
    paymentMethodNonce: clientData.nonce,
    amount: clientData.productTotal,

    // Customer
    customer: {
      firstName: clientData.firstName,
      lastName: clientData.surname,
      email: clientData.email
    },
   
    // Billing
    billing: {
      streetAddress: clientData.billingStreetAddress,
      postalCode: clientData.billingPostalCode,
    },

    // Shipping
    shipping: {
      firstName: clientData.firstName,
      lastName: clientData.surname,
      streetAddress: clientData.shippingStreetAddress,
      locality: clientData.shippingTown,
      region: clientData.shippingRegion,
      postalCode: clientData.shippingPostalCode,
      countryName: clientData.shippingCountry
    },

    // Product
    lineItems:[
      {
        kind: "debit",
        name: clientData.productName.substring(0, 34),
        description: clientData.productName,
        productCode: clientData.productID,
        quantity: clientData.productQty,
        unitAmount: clientData.productPrice,
        totalAmount: (Number(clientData.productPrice) * Number(clientData.productQty)).toString()
      }
    ],

    // Transaction options
    options: {
      submitForSettlement: true
    }

  }

  /*		=Create transaction
    ---------------------------------------- */

  var newTransaction = gateway.transaction.sale(saleOpts, function (error, result) {

    if (result) {
      res.send(result);

    } else {
      res.status(500).send(error);
    }
  });
});

module.exports = router;