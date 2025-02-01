'use client'
import { useEffect, useState } from "react";

type SensorData = {
  time: string;
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
      const newData: SensorData = JSON.parse(event.data);
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
  }, [url]);

  return data;
};