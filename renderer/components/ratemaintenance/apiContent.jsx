// // APIContext.js
// import React, { createContext, useContext, useState, useCallback } from "react";
// import axios from "axios";

// const APIContext = createContext();

// export const APIProvider = ({ children }) => {
//   const [rates, setRates] = useState([]);
//   const [rooms, setRooms] = useState([]);

//   const fetchRates = useCallback(async () => {
//     if (rates.length === 0) {
//       try {
//         const response = await axios.get("http://localhost:3000/getallrates");
//         if (response.data && Array.isArray(response.data.getRate)) {
//           const ratesWithIds = response.data.getRate.map((rate, index) => ({
//             ...rate,
//             id: index + 1,
//           }));
//           setRates(ratesWithIds);
//         }
//       } catch (error) {
//         console.error("Error fetching rates:", error);
//       }
//     }
//   }, [rates]);

//   // APIContext.js
//   const refreshRates = useCallback(async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/getallrates");
//       if (response.data && Array.isArray(response.data.getRate)) {
//         const ratesWithIds = response.data.getRate.map((rate, index) => ({
//           ...rate,
//           id: index + 1,
//         }));
//         setRates(ratesWithIds); // Update the state with the new rates
//       }
//     } catch (error) {
//       console.error("Error refreshing rates:", error);
//     }
//   }, []);

//   // New function to add a rate and refresh the list
//   const addRate = async (newRate) => {
//     try {
//       await axios.post("http://localhost:3000/addrates", newRate);
//       // Re-fetch the rates to update the list with the new rate
//       await fetchRates(true); // Force fetching even if rates are already loaded
//     } catch (error) {
//       console.error("Error adding rate:", error);
//     }
//   };

//   const fetchRooms = useCallback(async () => {
//     if (rooms.length === 0) {
//       try {
//         const response = await axios.get("http://localhost:3000/getallrooms");
//         if (response.data && Array.isArray(response.data.getrooms)) {
//           const roomsWithDetails = response.data.getrooms.map(
//             (room, index) => ({
//               ...room,
//               id: index + 1,
//               paymentStatus:
//                 room.generatedBillRecords.length > 0
//                   ? room.generatedBillRecords[0].payment_status
//                   : "Not Available",
//             })
//           );
//           setRooms(roomsWithDetails);
//         }
//       } catch (error) {
//         console.error("Error fetching rooms:", error);
//       }
//     }
//   }, [rooms]);

//   return (
//     <APIContext.Provider
//       value={{ rates, fetchRates, refreshRates,addRate, rooms, fetchRooms }}
//     >
//       {children}
//     </APIContext.Provider>
//   );
// };

// export const useAPI = () => useContext(APIContext);


import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const APIContext = createContext();

export const APIProvider = ({ children }) => {
  const [rates, setRates] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchRates = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/getallrates");
      if (response.data && Array.isArray(response.data.getRate)) {
        const ratesWithIds = response.data.getRate.map((rate, index) => ({
          ...rate,
          id: index + 1,
        }));
        setRates(ratesWithIds);
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  }, []);


  const refreshRates = useCallback(async () => {
    await fetchRates(); // Re-fetch the rates
  }, [fetchRates]);

  const refreshRooms = useCallback(async () => {
    await fetchRooms(); // Re-fetch the rates
  }, [fetchRooms]);


  const fetchRooms = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/getallrooms");
      if (response.data && Array.isArray(response.data.getrooms)) {
        const roomsWithDetails = response.data.getrooms.map((room, index) => ({
          ...room,
          id: index + 1,
          paymentStatus: room.generatedBillRecords.length > 0 ? room.generatedBillRecords[0].payment_status : "Not Available",
        }));
        setRooms(roomsWithDetails);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, []);

  return (
    <APIContext.Provider value={{ rates, fetchRates, refreshRates, rooms, fetchRooms,refreshRooms }}>
      {children}
    </APIContext.Provider>
  );
};

export const useAPI = () => useContext(APIContext);
