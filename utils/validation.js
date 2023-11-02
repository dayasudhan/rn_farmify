import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required('Phone number is required')
  .matches(
    /^(\+91[0-9]{10}|[0-9]{10})$/, // Change the regex pattern to match your desired phone number format
    "Invalid phone number, must be 10 digits"
  ),
   address: Yup.string().required("Address is required"),
    city: Yup.string().required("City/Village is required"),
   item_price: Yup.number().required("Item Rate or Price is reuired"),
   //description: Yup.string().required("description is required"),
   item_name: Yup.string().required("Item Name is required"),


});