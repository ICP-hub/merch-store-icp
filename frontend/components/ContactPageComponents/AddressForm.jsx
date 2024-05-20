import React, { useState, useEffect } from "react";
import UserAddressApiHandler from "../../apiHandlers/UserAddressApiHandler";
import useFormValidation from "../common/FormValidation";
import { CommonInput, TelephoneInput } from "../common/InputFields";
import { TailSpin } from "react-loader-spinner";
import countries from "./countries.json";
/* ----------------------------------------------------------------------------------------------------- */
/*  @ MyAddress Page : ShippingAddress page <MyAddressForm component/>.
/* ----------------------------------------------------------------------------------------------------- */
const AddressForm = ({
  onCancel,
  isNew,
  initialFormValues,
  setSuccessfulSubmit,
}) => {
  const [formValues, setFormValues] = useState(initialFormValues || {});
  const { createAddress, updateAddress, isLoading } = UserAddressApiHandler();
  const [phone, setPhone] = useState(null);
  const [isPhoneValid, setIsPhoneValid] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validationRules = {
    firstname: [{ required: true }],
    lastname: [{ required: true }],
    email: [
      {
        required: true,
        pattern: /^\S+@\S+\.\S+$/,
        error: "Invalid email",
      },
    ],
    addressline1: [{ required: true }],
    pincode: [
      { required: true },
      {
        pattern: /^\d+$/,
        error: "Pincode must contain only numbers",
      },
    ],
  };

  const { validationErrors, validateForm } = useFormValidation(validationRules);

  const handleChange = (key, value) => {
    setFormValues((prevForm) => ({ ...prevForm, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const errors = validateForm(formValues);
    if (Object.values(errors).some((error) => error) || !isPhoneValid) {
      return;
    }
    const updatedFormValues = {
      ...formValues,
      phone_number: phone.getNumber(),
    };
    createAddress(updatedFormValues, setSuccessfulSubmit);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const errors = validateForm(formValues);
    if (Object.values(errors).some((error) => error) || !isPhoneValid) {
      return;
    }
    const updatedFormValues = {
      ...formValues,
      phone_number: phone.getNumber(),
    };
    updateAddress(updatedFormValues, setSuccessfulSubmit);
  };

  useEffect(() => {
    setIsPhoneValid(phone?.isValidNumberPrecise());
  }, [phone]);

  const formFields = [
    { key: "firstname", label: "First Name", type: "text" },
    { key: "lastname", label: "Last Name", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "phone_number", label: "Phone Number", type: "tel" },
    { key: "addressline1", label: "Address Line 1", type: "text" },
    { key: "addressline2", label: "Address Line 2", type: "text" },
    { key: "pincode", label: "Pincode", type: "text" },
    { key: "country", label: "Country", type: "select" },
    { key: "state", label: "State", type: "text" },
    { key: "city", label: "City", type: "text" },
  ];

  return (
    <form
      onSubmit={isNew ? handleSubmit : handleUpdateSubmit}
      className="grid lg:grid-cols-2 gap-3 px-2 sm:px-8 py-4 border-t"
    >
      {formFields.map((field) => {
        const { key, type, label } = field;

        return type === "tel" ? (
          <TelephoneInput
            key={key}
            label={label}
            divClass="border border-gray-300 rounded-full p-[6px]"
            inputclassName="focus:outline-none p-2 h-[38px] placeholder:font-light"
            setPhone={setPhone}
            phoneNumber={formValues?.phone_number}
            error={!isPhoneValid && isSubmitted}
          />
        ) : type === "select" && key === "country" ? (
          <div key={key} className="flex flex-col gap-1 w-full">
            <div className="flex">
              <label className="h-full flex items-center w-full font-medium uppercase text-xs px-3">
                {label}
              </label>
              {validationErrors[key] && (
                <span className="text-red-500 text-xs min-w-max">
                  {validationErrors[key]}
                </span>
              )}
            </div>
            <select
              value={formValues[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="border border-gray-300 rounded-full focus:outline-none p-2 h-[38px] placeholder:font-light"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div key={key} className="flex flex-col gap-1 w-full">
            <div className="flex">
              <label className="h-full flex items-center w-full font-medium uppercase text-xs px-3">
                {label}
              </label>
              {validationErrors[key] && (
                <span className="text-red-500 text-xs min-w-max">
                  {validationErrors[key]}
                </span>
              )}
            </div>
            <CommonInput
              type={type}
              placeholder={label.toLowerCase()}
              value={formValues[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        );
      })}
      <div className="py-6 flex gap-3">
        <button
          type="submit"
          className="p-2 min-w-[126px] text-white border border-gray-700 bg-gray-700 rounded-full font-medium text-sm relative"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <TailSpin
                visible={true}
                height="20"
                width="20"
                color="white"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperclassName=""
              />
            </div>
          ) : isNew ? (
            "Save Address"
          ) : (
            "Update Address"
          )}
        </button>
        <button
          type="button"
          className="p-2 text-black bg-white border border-gray-900 rounded-full font-medium text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
