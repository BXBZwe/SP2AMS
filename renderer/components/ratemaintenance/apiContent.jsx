import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const APIContext = createContext();

export const APIProvider = ({ children }) => {
  const [rates, setRates] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [requests, setRequests] = useState([]);

  const [tenancyRecords, setTenancyRecords] = useState([]);

  const fetchTenancyRecords = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/getalltenancyrecord");
      if (response.data && Array.isArray(response.data)) {
        // Assuming the response directly contains an array of tenancy records
        const recordsWithIds = response.data.map((record, index) => ({
          ...record,
          id: index + 1, // Adding an id property if it's not already included
        }));
        setTenancyRecords(recordsWithIds);
      }
    } catch (error) {
      console.error("Error fetching tenancy records:", error);
    }
  }, []);

  const refreshTenancyRecords = useCallback(async () => {
    await fetchTenancyRecords(); // Re-fetch the tenancy records
  }, [fetchTenancyRecords]);

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

  const refreshRooms = useCallback(async () => {
    await fetchRooms(); // Re-fetch the rates
  }, [fetchRooms]);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/getallrequests");
      if (response.data && Array.isArray(response.data.getRequests)) {
        const detailedRequests = response.data.getRequests.map((request) => ({
          ...request,
        }));
        setRequests(detailedRequests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }, []);

  const refreshRequests = useCallback(async () => {
    await fetchRequests(); // Re-fetch the requests
  }, [fetchRequests]);

  return (
    <APIContext.Provider
      value={{
        rates,
        fetchRates,
        refreshRates,
        rooms,
        fetchRooms,
        refreshRooms,
        requests,
        fetchRequests,
        refreshRequests,
        tenancyRecords,
        fetchTenancyRecords,
        refreshTenancyRecords,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

export const useAPI = () => useContext(APIContext);
