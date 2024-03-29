import React, { useState } from 'react';
import { Typography, Radio, RadioGroup, FormControlLabel, Button, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import useRazorpay from "react-razorpay";
import axios from '../../../../api/axios';
import {config} from "../../../../Helpers/axiosUserEndpoints"
import Spinner from '../../../../component/Spinner';


const useStyles = makeStyles({
  centerItems: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  radioGroup: {
    margin: '16px 0',
  },
  submitButton: {
    marginTop: 16,
  },
  courseImage: {
    maxWidth: '100%',
    maxHeight: 400,
  },
  pageTitle: {
    marginBottom: 32,
  },
  paymentDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 32,
    border: '1px solid #ccc',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  paymentOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 16,
  },
  paymentButton: {
    marginTop: 32,
  },
});

const Payment = () => {

  const navigate = useNavigate();
  const Razorpay = useRazorpay();

  const uid = localStorage.getItem("uid");
  
  const [paymentOption, setPaymentOption] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const selectedCourses = location.state;
  const course_id = selectedCourses.course_id;
  const name = selectedCourses.name;
  const image = selectedCourses.image;
  const des = selectedCourses.description;
  const price = selectedCourses.totalAmount;
  const link = selectedCourses.link;
  const list=selectedCourses.list
  const teacherid = selectedCourses.teacherid;

  const data=selectedCourses;
  console.log(data)

  const handleRadioChange = (event) => {
    setPaymentOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(`Payment Option: ${paymentOption}`);
    // Here you can add code to handle the form submission based on the selected payment option
  };

  const classes = useStyles();

  function handlePayment() {
    setLoading(true);
    axios
      .post("/api/orderConfirmed", {
        user_id: uid,
        name: name,
        totalAmount: price,
        image:image,
        course_id:course_id,
        link:link,
        teacherid:teacherid,
        list:list
      },config)
      .then((response) => {
        setLoading(false);
        console.log(response);
        const order = response.data[0].orders;
        var options = {
          key: "rzp_test_XUbZpvWoTVZ2ie", // Enter the Key ID generated from the Dashboard
          amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "edura", //your business name
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          handler: function (response) {
            verifyPayment(response, order);
          },
            prefill: {
              name: "rentacar",
              email: "misahlnunu@gmail.com",
              contact: "9999999999",
            },
            notes: {
              address: "Razorpay Corporate Office",
            },
            theme: {
              color: "#235784",
            },
          };
          var rzp1 = new Razorpay(options);
          rzp1.on("payment.failed", function (response) {
            //redirect to payment failed page
          });
          rzp1.open();
        })
        .catch((err) => {
          console.log(err);
         localStorage.removeItem("usertoken");
        localStorage.removeItem("uid");
        });
    
  }

  function verifyPayment(response, order) {
     setLoading(true);
    axios
      .post("/api/verifyPayment", {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        order,
        userId: uid,
        data
      },config)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          navigate("/user/success");
        } else {
          navigate("/user/failed");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (


    <>
    {loading ? (
      <Spinner loading={loading} />
    ) : (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h4" align="center">
          Payment Details
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} className={classes.centerItems}>
       {image && image[0] && <img src={image[0].url} alt={name} className={classes.courseImage} />}

      </Grid>
      <Grid item xs={12} md={6} className={classes.centerItems}>
        <Typography variant="h6">{name}</Typography>
        <Typography>{des}</Typography>
        <Typography variant="h6">Total Amount:{price}</Typography>
        <form onSubmit={handleSubmit} className={classes.centerItems}>
          <RadioGroup value={paymentOption} onChange={handleRadioChange} className={classes.radioGroup}>
            {/* <FormControlLabel value="online" control={<Radio />} label="Online Payment" /> */}
           
          </RadioGroup>
          <Button onClick={handlePayment} type='button' variant="contained" color="primary" className={classes.submitButton}>
           Pay
          </Button>
        </form>
      </Grid>
    </Grid>
      )}
      </>
  );
};

export default Payment;
