import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Please Enter Name"),
  phone: Yup.string().required('Please Enter Phone number')
  .matches(
    /^(\+91[0-9]{10}|[0-9]{10})$/, // Change the regex pattern to match your desired phone number format
    "Invalid phone number, must be 10 digits"
  ),
   address: Yup.string().required("Please Enter Address"),
   city: Yup.string().required("Please Enter City or Village"),
   item_price: Yup.mixed().test('is-number', 'Invalid Item Rate. Must be a number', (value) => {
    return !isNaN(value);
  }).required("Please Enter Item Rate"),
   //description: Yup.string().required("description is required"),
   item_name: Yup.string().required("Please Enter Item Name"),


});