import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";

const SalesPrediction = () => {
    const [model, setModel] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [training, setTraining] = useState(false);

    // 1️⃣ Generate Dummy Sales Data
    const generateData = () => {
        let inputs = [];
        let outputs = [];
        for (let i = 0; i < 1000; i++) {
            let previous_sales = Math.random() * 500; // Random past sales
            let day_of_week = Math.floor(Math.random() * 7); // 0-6 (Monday-Sunday)
            let holiday_flag = Math.random() > 0.8 ? 1 : 0; // 20% holidays

            let future_sales = previous_sales * (1 + Math.random() * 0.2) + (holiday_flag ? 50 : 0); // Simulated growth

            inputs.push([previous_sales, day_of_week, holiday_flag]);
            outputs.push([future_sales]);
        }
        return { inputs, outputs };
    };

    // 2️⃣ Train the Model
    const trainModel = async () => {
        setTraining(true);
        const { inputs, outputs } = generateData();

        const xs = tf.tensor2d(inputs);
        const ys = tf.tensor2d(outputs);

        const newModel = tf.sequential();
        newModel.add(tf.layers.dense({ units: 64, inputShape: [3], activation: "relu" }));
        newModel.add(tf.layers.dense({ units: 32, activation: "relu" }));
        newModel.add(tf.layers.dense({ units: 1 }));

        newModel.compile({ optimizer: "adam", loss: "meanSquaredError" });

        await newModel.fit(xs, ys, { epochs: 50, batchSize: 32 });

        setModel(newModel);
        setTraining(false);
        alert("Model Trained!");
    };

    // 3️⃣ Predict Future Sales
    const predictSales = async () => {
        if (!model) return alert("Train the model first!");

        const inputData = tf.tensor2d([[200, 2, 0]]); // Example: 200 sales, Tuesday, Not Holiday
        const output = model.predict(inputData);
        const result = await output.array();
        setPrediction(result[0][0]);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Stock Demand Prediction</h2>
            <button onClick={trainModel} >
                {training ? "Training..." : "Train Model"}
            </button>
            <button onClick={predictSales} disabled={!model}>
                Predict Sales
            </button>
            {prediction !== null && <h3>Predicted Sales: {prediction.toFixed(2)}</h3>}
        </div>
    );
};

export default SalesPrediction;
