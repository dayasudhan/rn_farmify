import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required('Phone number is required')
  .matches(
    /^[0-9]{10}$/, // Change the regex pattern to match your desired phone number format
    "Invalid phone number, must be 10 digits"
  ),
  address: Yup.string().required("Address is required")
});