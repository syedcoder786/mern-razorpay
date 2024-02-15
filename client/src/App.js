import React from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { proxy } from "./config/default";

function App() {
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  //   const __DEV__ = (document.domain = "localhost");

  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = await axios.post(proxy + "/payment/orders");

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_test_O0kB4AvhcsAAYn", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Buy React",
      description: "Buy React in ₹ " + amount / 100,
      image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post(proxy + "/payment/success", data);

        alert(result.data.msg);
      },
      prefill: {
        name: "Test",
        email: "test@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Test Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Buy React now!</p>
        <button
          className="App-link"
          onClick={displayRazorpay}
          style={{ color: "black", cursor: "pointer", padding: "8px" }}
        >
          Pay ₹500
        </button>
      </header>
    </div>
  );
}

export default App;
