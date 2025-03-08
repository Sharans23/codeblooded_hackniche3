import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const InventoryAnalyzer = ({ apiKey }) => {
  const [data, setData] = useState({
    client1: {
      2022: {
        January: {
          week1: {
            orders: { laptop: 10, mobile: 20, tablet: 15 },
            remaining_stock: { laptop: 90, mobile: 80, tablet: 85 },
          },
          week2: {
            orders: { laptop: 5, mobile: 10, tablet: 8 },
            remaining_stock: { laptop: 85, mobile: 70, tablet: 77 },
          },
          week3: {
            orders: { laptop: 8, mobile: 12, tablet: 5 },
            remaining_stock: { laptop: 77, mobile: 58, tablet: 72 },
          },
          week4: {
            orders: { laptop: 12, mobile: 18, tablet: 10 },
            remaining_stock: { laptop: 65, mobile: 40, tablet: 62 },
          },
        },
        February: {
          week1: {
            orders: { laptop: 9, mobile: 14, tablet: 7 },
            remaining_stock: { laptop: 56, mobile: 26, tablet: 55 },
          },
          week2: {
            orders: { laptop: 6, mobile: 10, tablet: 9 },
            remaining_stock: { laptop: 50, mobile: 16, tablet: 46 },
          },
          week3: {
            orders: { laptop: 5, mobile: 8, tablet: 6 },
            remaining_stock: { laptop: 45, mobile: 8, tablet: 40 },
          },
          week4: {
            orders: { laptop: 10, mobile: 15, tablet: 12 },
            remaining_stock: { laptop: 35, mobile: 0, tablet: 28 },
          },
        },
        March: {
          week1: {
            orders: { laptop: 7, mobile: 10, tablet: 8 },
            remaining_stock: { laptop: 28, mobile: 0, tablet: 20 },
          },
          week2: {
            orders: { laptop: 6, mobile: 12, tablet: 5 },
            remaining_stock: { laptop: 22, mobile: 0, tablet: 15 },
          },
          week3: {
            orders: { laptop: 5, mobile: 10, tablet: 7 },
            remaining_stock: { laptop: 17, mobile: 0, tablet: 8 },
          },
          week4: {
            orders: { laptop: 12, mobile: 14, tablet: 9 },
            remaining_stock: { laptop: 5, mobile: 0, tablet: 0 },
          },
        },
        April: {
          week1: {
            orders: { laptop: 8, mobile: 12, tablet: 10 },
            remaining_stock: { laptop: 92, mobile: 78, tablet: 90 },
          },
          week2: {
            orders: { laptop: 6, mobile: 15, tablet: 9 },
            remaining_stock: { laptop: 86, mobile: 63, tablet: 81 },
          },
          week3: {
            orders: { laptop: 5, mobile: 10, tablet: 7 },
            remaining_stock: { laptop: 81, mobile: 53, tablet: 74 },
          },
          week4: {
            orders: { laptop: 9, mobile: 14, tablet: 12 },
            remaining_stock: { laptop: 72, mobile: 39, tablet: 62 },
          },
        },
        May: {
          week1: {
            orders: { laptop: 10, mobile: 20, tablet: 15 },
            remaining_stock: { laptop: 62, mobile: 19, tablet: 47 },
          },
          week2: {
            orders: { laptop: 5, mobile: 10, tablet: 8 },
            remaining_stock: { laptop: 57, mobile: 9, tablet: 39 },
          },
          week3: {
            orders: { laptop: 8, mobile: 12, tablet: 5 },
            remaining_stock: { laptop: 49, mobile: 0, tablet: 34 },
          },
          week4: {
            orders: { laptop: 12, mobile: 18, tablet: 10 },
            remaining_stock: { laptop: 37, mobile: 0, tablet: 24 },
          },
        },
        June: {
          week1: {
            orders: { laptop: 9, mobile: 14, tablet: 7 },
            remaining_stock: { laptop: 28, mobile: 0, tablet: 17 },
          },
          week2: {
            orders: { laptop: 6, mobile: 10, tablet: 9 },
            remaining_stock: { laptop: 22, mobile: 0, tablet: 8 },
          },
          week3: {
            orders: { laptop: 5, mobile: 8, tablet: 6 },
            remaining_stock: { laptop: 17, mobile: 0, tablet: 2 },
          },
          week4: {
            orders: { laptop: 10, mobile: 15, tablet: 12 },
            remaining_stock: { laptop: 7, mobile: 0, tablet: 0 },
          },
        },
        July: {
          week1: {
            orders: { laptop: 7, mobile: 10, tablet: 8 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week2: {
            orders: { laptop: 6, mobile: 12, tablet: 5 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week3: {
            orders: { laptop: 5, mobile: 10, tablet: 7 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week4: {
            orders: { laptop: 12, mobile: 14, tablet: 9 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
        },
        August: {
          week1: {
            orders: { laptop: 8, mobile: 12, tablet: 10 },
            remaining_stock: { laptop: 92, mobile: 78, tablet: 90 },
          },
          week2: {
            orders: { laptop: 6, mobile: 15, tablet: 9 },
            remaining_stock: { laptop: 86, mobile: 63, tablet: 81 },
          },
          week3: {
            orders: { laptop: 5, mobile: 10, tablet: 7 },
            remaining_stock: { laptop: 81, mobile: 53, tablet: 74 },
          },
          week4: {
            orders: { laptop: 9, mobile: 14, tablet: 12 },
            remaining_stock: { laptop: 72, mobile: 39, tablet: 62 },
          },
        },
        September: {
          week1: {
            orders: { laptop: 10, mobile: 20, tablet: 15 },
            remaining_stock: { laptop: 62, mobile: 19, tablet: 47 },
          },
          week2: {
            orders: { laptop: 5, mobile: 10, tablet: 8 },
            remaining_stock: { laptop: 57, mobile: 9, tablet: 39 },
          },
          week3: {
            orders: { laptop: 8, mobile: 12, tablet: 5 },
            remaining_stock: { laptop: 49, mobile: 0, tablet: 34 },
          },
          week4: {
            orders: { laptop: 12, mobile: 18, tablet: 10 },
            remaining_stock: { laptop: 37, mobile: 0, tablet: 24 },
          },
        },
        October: {
          week1: {
            orders: { laptop: 9, mobile: 14, tablet: 7 },
            remaining_stock: { laptop: 28, mobile: 0, tablet: 17 },
          },
          week2: {
            orders: { laptop: 6, mobile: 10, tablet: 9 },
            remaining_stock: { laptop: 22, mobile: 0, tablet: 8 },
          },
          week3: {
            orders: { laptop: 5, mobile: 8, tablet: 6 },
            remaining_stock: { laptop: 17, mobile: 0, tablet: 2 },
          },
          week4: {
            orders: { laptop: 10, mobile: 15, tablet: 12 },
            remaining_stock: { laptop: 7, mobile: 0, tablet: 0 },
          },
        },
        November: {
          week1: {
            orders: { laptop: 7, mobile: 10, tablet: 8 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week2: {
            orders: { laptop: 6, mobile: 12, tablet: 5 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week3: {
            orders: { laptop: 5, mobile: 10, tablet: 7 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week4: {
            orders: { laptop: 12, mobile: 14, tablet: 9 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
        },
        December: {
          week1: {
            orders: { laptop: 8, mobile: 12, tablet: 10 },
            remaining_stock: { laptop: 92, mobile: 78, tablet: 90 },
          },
          week2: {
            orders: { laptop: 6, mobile: 15, tablet: 9 },
            remaining_stock: { laptop: 86, mobile: 63, tablet: 81 },
          },
          week3: {
            orders: { laptop: 5, mobile: 10, tablet: 7 },
            remaining_stock: { laptop: 81, mobile: 53, tablet: 74 },
          },
          week4: {
            orders: { laptop: 9, mobile: 14, tablet: 12 },
            remaining_stock: { laptop: 72, mobile: 39, tablet: 62 },
          },
        },
      },
      2023: {
        January: {
          week1: {
            orders: { laptop: 10, mobile: 20, tablet: 15 },
            remaining_stock: { laptop: 62, mobile: 19, tablet: 47 },
          },
          week2: {
            orders: { laptop: 5, mobile: 10, tablet: 8 },
            remaining_stock: { laptop: 57, mobile: 9, tablet: 39 },
          },
          week3: {
            orders: { laptop: 8, mobile: 12, tablet: 5 },
            remaining_stock: { laptop: 49, mobile: 0, tablet: 34 },
          },
          week4: {
            orders: { laptop: 12, mobile: 18, tablet: 10 },
            remaining_stock: { laptop: 37, mobile: 0, tablet: 24 },
          },
        },
        February: {
          week1: {
            orders: { laptop: 9, mobile: 14, tablet: 7 },
            remaining_stock: { laptop: 28, mobile: 0, tablet: 17 },
          },
          week2: {
            orders: { laptop: 6, mobile: 10, tablet: 9 },
            remaining_stock: { laptop: 22, mobile: 0, tablet: 8 },
          },
          week3: {
            orders: { laptop: 5, mobile: 8, tablet: 6 },
            remaining_stock: { laptop: 17, mobile: 0, tablet: 2 },
          },
          week4: {
            orders: { laptop: 10, mobile: 15, tablet: 12 },
            remaining_stock: { laptop: 7, mobile: 0, tablet: 0 },
          },
        },
        March: {
          week1: {
            orders: { laptop: 7, mobile: 10, tablet: 8 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week2: {
            orders: { laptop: 6, mobile: 12, tablet: 5 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week3: {
            orders: { laptop: 5, mobile: 10, tablet: 7 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week4: {
            orders: { laptop: 12, mobile: 14, tablet: 9 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
        },
        April: {
          week1: {
            orders: { laptop: 8, mobile: 12, tablet: 10 },
            remaining_stock: { laptop: 92, mobile: 78, tablet: 90 },
          },
          week2: {
            orders: { laptop: 6, mobile: 15, tablet: 9 },
            remaining_stock: { laptop: 86, mobile: 63, tablet: 81 },
          },
          week3: {
            orders: { laptop: 5, mobile: 10, tablet: 7 },
            remaining_stock: { laptop: 81, mobile: 53, tablet: 74 },
          },
          week4: {
            orders: { laptop: 9, mobile: 14, tablet: 12 },
            remaining_stock: { laptop: 72, mobile: 39, tablet: 62 },
          },
        },
        May: {
          week1: {
            orders: { laptop: 10, mobile: 20, tablet: 15 },
            remaining_stock: { laptop: 62, mobile: 19, tablet: 47 },
          },
          week2: {
            orders: { laptop: 5, mobile: 10, tablet: 8 },
            remaining_stock: { laptop: 57, mobile: 9, tablet: 39 },
          },
          week3: {
            orders: { laptop: 8, mobile: 12, tablet: 5 },
            remaining_stock: { laptop: 49, mobile: 0, tablet: 34 },
          },
          week4: {
            orders: { laptop: 12, mobile: 18, tablet: 10 },
            remaining_stock: { laptop: 37, mobile: 0, tablet: 24 },
          },
        },
        June: {
          week1: {
            orders: { laptop: 9, mobile: 14, tablet: 7 },
            remaining_stock: { laptop: 28, mobile: 0, tablet: 17 },
          },
          week2: {
            orders: { laptop: 6, mobile: 10, tablet: 9 },
            remaining_stock: { laptop: 22, mobile: 0, tablet: 8 },
          },
          week3: {
            orders: { laptop: 5, mobile: 8, tablet: 6 },
            remaining_stock: { laptop: 17, mobile: 0, tablet: 2 },
          },
          week4: {
            orders: { laptop: 10, mobile: 15, tablet: 12 },
            remaining_stock: { laptop: 7, mobile: 0, tablet: 0 },
          },
        },
        July: {
          week1: {
            orders: { laptop: 7, mobile: 10, tablet: 8 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week2: {
            orders: { laptop: 6, mobile: 12, tablet: 5 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week3: {
            orders: { laptop: 5, mobile: 10, tablet: 7 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week4: {
            orders: { laptop: 12, mobile: 14, tablet: 9 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
        },
        August: {
          week1: {
            orders: { laptop: 8, mobile: 12, tablet: 10 },
            remaining_stock: { laptop: 92, mobile: 78, tablet: 90 },
          },
          week2: {
            orders: { laptop: 6, mobile: 15, tablet: 9 },
            remaining_stock: { laptop: 86, mobile: 63, tablet: 81 },
          },
          week3: {
            orders: { laptop: 5, mobile: 10, tablet: 7 },
            remaining_stock: { laptop: 81, mobile: 53, tablet: 74 },
          },
          week4: {
            orders: { laptop: 9, mobile: 14, tablet: 12 },
            remaining_stock: { laptop: 72, mobile: 39, tablet: 62 },
          },
        },
        September: {
          week1: {
            orders: { laptop: 10, mobile: 20, tablet: 15 },
            remaining_stock: { laptop: 62, mobile: 19, tablet: 47 },
          },
          week2: {
            orders: { laptop: 5, mobile: 10, tablet: 8 },
            remaining_stock: { laptop: 57, mobile: 9, tablet: 39 },
          },
          week3: {
            orders: { laptop: 8, mobile: 12, tablet: 5 },
            remaining_stock: { laptop: 49, mobile: 0, tablet: 34 },
          },
          week4: {
            orders: { laptop: 12, mobile: 18, tablet: 10 },
            remaining_stock: { laptop: 37, mobile: 0, tablet: 24 },
          },
        },
        October: {
          week1: {
            orders: { laptop: 9, mobile: 14, tablet: 7 },
            remaining_stock: { laptop: 28, mobile: 0, tablet: 17 },
          },
          week2: {
            orders: { laptop: 6, mobile: 10, tablet: 9 },
            remaining_stock: { laptop: 22, mobile: 0, tablet: 8 },
          },
          week3: {
            orders: { laptop: 5, mobile: 8, tablet: 6 },
            remaining_stock: { laptop: 17, mobile: 0, tablet: 2 },
          },
          week4: {
            orders: { laptop: 10, mobile: 15, tablet: 12 },
            remaining_stock: { laptop: 7, mobile: 0, tablet: 0 },
          },
        },
        November: {
          week1: {
            orders: { laptop: 7, mobile: 10, tablet: 8 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week2: {
            orders: { laptop: 6, mobile: 12, tablet: 5 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week3: {
            orders: { laptop: 5, mobile: 10, tablet: 7 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
          week4: {
            orders: { laptop: 12, mobile: 14, tablet: 9 },
            remaining_stock: { laptop: 0, mobile: 0, tablet: 0 },
          },
        },
        December: {
          week1: {
            orders: { laptop: 8, mobile: 12, tablet: 10 },
            remaining_stock: { laptop: 92, mobile: 78, tablet: 90 },
          },
          week2: {
            orders: { laptop: 6, mobile: 15, tablet: 9 },
            remaining_stock: { laptop: 86, mobile: 63, tablet: 81 },
          },
          week3: {
            orders: { laptop: 5, mobile: 10, tablet: 7 },
            remaining_stock: { laptop: 81, mobile: 53, tablet: 74 },
          },
          week4: {
            orders: { laptop: 9, mobile: 14, tablet: 12 },
            remaining_stock: { laptop: 72, mobile: 39, tablet: 62 },
          },
        },
      },
    },
  });

  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeData = async () => {
    setLoading(true);
    setSuggestions(""); // Clear previous suggestions
    try {
      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Prepare the prompt
      const prompt = `
        You are a data analyst helping a client optimize their inventory management. Below is the client's purchasing and selling data for the years 2022 and 2023. Analyze the data and provide suggestions on when to buy and when to sell each product (laptop, mobile, tablet) based on demand patterns.

        Data:
        ${JSON.stringify(data, null, 2)}

        Questions:
        1. Identify peak demand periods for each product.
        2. Suggest when to buy more stock for each product to avoid stockouts.
        3. Suggest when to sell more stock for each product to maximize revenue.
        4. Provide general inventory management tips based on the data.
      `;

      // Call Gemini API
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setSuggestions(text);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setSuggestions("Failed to fetch suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Inventory Analyzer</h2>
      <button onClick={analyzeData} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Data"}
      </button>
      {suggestions && (
        <div>
          <h3>Suggestions:</h3>
          <pre>{suggestions}</pre>
        </div>
      )}
    </div>
  );
};

export default InventoryAnalyzer;
