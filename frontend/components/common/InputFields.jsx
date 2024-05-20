import React, { useEffect, useRef, useState } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import "intl-tel-input/build/js/utils.js";
import "./Styles/itelinput.css";
//import { Country, State, City } from "country-state-city";

/* ----------------------------------------------------------------------------------------------------- */
/*  @ Common Input Component 
/* ----------------------------------------------------------------------------------------------------- */
const CommonInput = ({
  type,
  placeholder,
  label,
  value,
  onChange,
  disabled,
  divClass,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full items-center">
      <label className="h-full flex items-center w-full font-medium uppercase text-xs px-3">
        {label}
      </label>
      <div className="w-full flex">
        <input
          type={type}
          placeholder={placeholder}
          className={`focus:outline-none flex-1 px-3 py-2 border border-gray-300 h-full rounded-full text-black w-full placeholder:capitalize placeholder:font-light ${divClass}`}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------------------------------------------- */
/*  @ Telephone Input Component ITel
/* ----------------------------------------------------------------------------------------------------- */
const TelephoneInput = ({
  divClass,
  inputClass,
  label,
  disabled,
  setPhone,
  phoneNumber,
  error,
}) => {
  const phoneInputRef = useRef(null);

  useEffect(() => {
    const iti = intlTelInput(phoneInputRef.current, {
      showSelectedDialCode: true,
      countrySearch: false,
      initialCountry: "auto",
      geoIpLookup: (callback) => {
        fetch("https://ipapi.co/json")
          .then((res) => res.json())
          .then((data) => callback(data.country_code))
          .catch(() => callback());
      },
    });

    if (setPhone) {
      setPhone(iti);
    }
    if (phoneNumber !== undefined) {
      iti.setNumber(phoneNumber);
    }

    return () => {
      iti.destroy();
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        {label && (
          <label className="w-full font-medium uppercase text-xs px-3 mb-1">
            {label}
          </label>
        )}
        {error && (
          <span className="text-red-500 text-xs px-3 min-w-max">
            Invalid Phone Number
          </span>
        )}
      </div>
      <div className={divClass}>
        <input
          type="tel"
          id="phone"
          ref={phoneInputRef}
          className={inputClass}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------------------------------------------- */
/*  @ CountryInput : country-state-city : https://www.npmjs.com/package/country-state-city
/* ----------------------------------------------------------------------------------------------------- */
// const CountryInput = ({
//   setLocationInput,
//   currCountry,
//   currState,
//   currCity,
// }) => {
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);

//   useEffect(() => {
//     setSelectedCountry("");
//     setSelectedState("");
//     setCities([]);
//   }, []);

//   const handleCountryChange = (event) => {
//     const countryCode = event.target.value;
//     setSelectedCountry(countryCode);
//     const statesOfSelectedCountry = State.getStatesOfCountry(countryCode);
//     setStates(statesOfSelectedCountry);
//     setSelectedState("");

//     setLocationInput({
//       country: event.target.options[event.target.selectedIndex].text,
//       state: "",
//       city: "",
//     });
//   };

//   const handleStateChange = (event) => {
//     const stateCode = event.target.value;
//     setSelectedState(stateCode);
//     const citiesOfSelectedState = City.getCitiesOfState(
//       selectedCountry,
//       stateCode
//     );
//     setCities(citiesOfSelectedState);

//     setLocationInput((prev) => ({
//       ...prev,
//       state: event.target.options[event.target.selectedIndex].text,
//       city: "",
//     }));
//   };

//   const handleCityChange = (event) => {
//     setLocationInput((prev) => ({
//       ...prev,
//       city: event.target.value,
//     }));
//   };

//   const countries = Country.getAllCountries().map((country) => ({
//     value: country.isoCode,
//     label: country.name,
//   }));

//   const stateOptions = states.map((state) => ({
//     value: state.isoCode,
//     label: state.name,
//   }));

//   const cityOptions = cities.map((city) => ({
//     value: city.name,
//     label: city.name,
//   }));

//   return (
//     <>
//       <div className="flex flex-col gap-1 w-full items-center">
//         <label className="h-full flex items-center w-full font-medium uppercase text-xs px-3">
//           Country
//         </label>
//         <select
//           className="focus:outline-none flex-1 px-3 py-2 border border-gray-300 h-full rounded-full text-black w-full placeholder:capitalize placeholder:font-light"
//           name="country"
//           value={selectedCountry}
//           onChange={handleCountryChange}
//         >
//           <option value="">{currCountry || "Select Country"}</option>
//           {countries.map((option) => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="flex flex-col gap-1 w-full items-center">
//         <label className="h-full flex items-center w-full font-medium uppercase text-xs px-3">
//           State
//         </label>
//         <select
//           className="focus:outline-none flex-1 px-3 py-2 border border-gray-300 h-full rounded-full text-black w-full placeholder:capitalize placeholder:font-light"
//           name="state"
//           value={selectedState}
//           onChange={handleStateChange}
//           disabled={!selectedCountry}
//         >
//           <option value="">{currState || "Select State"}</option>
//           {stateOptions.map((option) => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="flex flex-col gap-1 w-full items-center">
//         <label className="flex items-center w-full font-medium uppercase text-xs px-3">
//           City
//         </label>
//         <select
//           className="focus:outline-none flex-1 px-3 py-2 border border-gray-300 h-full rounded-full text-black w-full placeholder:capitalize placeholder:font-light"
//           name="city"
//           value={currCity}
//           onChange={handleCityChange}
//           disabled={!selectedState}
//         >
//           <option value="">{currCity || "Select City"}</option>
//           {cityOptions.map((option) => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//       </div>
//     </>
//   );
// };

export { CommonInput, TelephoneInput };
