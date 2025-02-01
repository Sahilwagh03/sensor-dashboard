'use client';
import { useEffect, useState } from "react";

type SensorData = {
  time: number; // Numeric time
  alcohol: number;
  ammonia: number;
  carbonmonoxide: number;
  carbondioxide: number;
};

export const useWebSocket = (url: string) => {
  const [data, setData] = useState<SensorData[]>([]);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.onmessage = (event) => {
      const rawData = JSON.parse(event.data); // Incoming raw data (4 values)
      const newData: SensorData = {
        time: data.length % 24, // Calculate time as index (0 to 23)
        alcohol: rawData.alcohol,
        ammonia: rawData.ammonia,
        carbonmonoxide: rawData.carbonmonoxide,
        carbondioxide: rawData.carbondioxide,
      };

      setData((prevData) => {
        const updatedData = [...prevData, newData];
        // Keep only the last 24 entries
        if (updatedData.length > 24) {
          updatedData.shift();
        }
        return updatedData;
      });
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      socket.close();
    };
  }, [url, data.length]); // Add data.length to dependencies

  return data;
};