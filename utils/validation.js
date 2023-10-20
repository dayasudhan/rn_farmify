import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().matches(
    /^[0-9]{10}$/, // Change the regex pattern to match your desired phone number format
    "Invalid phone number, must be 10 digits"
  )
  // address: Yup.string().required("Address is required"),
  // city: Yup.string().required("City/Village is required"),
  // personToContact: Yup.string().required("Person to Contact is required"),
  // personToContactPhone: Yup.string().matches(
  //   /^[0-9]{10}$/, // Change the regex pattern to match your desired phone number format
  //   "Invalid phone number, must be 10 digits"
  // ),
  // pestsToControl: Yup.string().required("PestsToControl is required"),
  // paymentTerms: Yup.string().required("PaymentTerms is required"),
  // billingInstructions: Yup.string().required("BillingInstructions is required"),
  // serviceBeginDate: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: 'Date must be in YYYY-MM-DD format',
  // }),
  // serviceExpirationDate: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: 'Date must be in YYYY-MM-DD format',
  // }),

});