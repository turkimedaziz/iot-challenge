import React, { useState, useEffect } from "react";
import { Box, Text, VStack, Heading, Grid, GridItem, Flex } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components for Line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const getBoxColor = (value: number, type: "temperature" | "vibration" | "pressure") => {
  if (type === "temperature" && value > 60) return "red.500";
  if (type === "vibration" && value > 5) return "red.500";
  if (type === "pressure" && value > 2) return "red.500";
  return "white";
};

function App() {
  const [temperature, setTemperature] = useState(22.5);
  const [vibration, setVibration] = useState(0.1);
  const [pressure, setPressure] = useState(1.2);

  const [chartData, setChartData] = useState({
    labels: ["Temperature", "Vibration", "Pressure"],
    datasets: [
      {
        label: "Sensor Values",
        data: [temperature, vibration, pressure],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  });

  const fetchSensorData = async () => {
    try {
      const response = await fetch('http://your-sensor-api-url.com/data');
      const data = await response.json();
      setTemperature(data.temperature);
      setVibration(data.vibration);
      setPressure(data.pressure);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSensorData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setChartData({
      labels: ["Temperature", "Vibration", "Pressure"],
      datasets: [
        {
          label: "Sensor Values",
          data: [temperature, vibration, pressure],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    });
  }, [temperature, vibration, pressure]);

  return (
    <Flex minHeight="100vh">
      <Box
        width="250px"
        bg="blue.500"
        color="white"
        p={5}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading size="lg">Machine ID</Heading>
        <Text fontSize="xl" mt={4}>Machine1</Text>
      </Box>

      <Box flex="1" p={5}>
        <VStack gap={5} align="stretch">
          <Heading>Dashboard</Heading>

          <Grid templateColumns="repeat(3, 1fr)" gap={5}>
            <GridItem>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="md"
                bg={getBoxColor(temperature, "temperature")}
                h="100%"
              >
                <Text fontSize="xl" fontWeight="bold">Temperature</Text>
                <Text fontSize="2xl" color={getBoxColor(temperature, "temperature") === "red.500" ? "white" : "blue.500"}>
                  {temperature.toFixed(2)} °C
                </Text>
              </Box>
            </GridItem>

            <GridItem>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="md"
                bg={getBoxColor(vibration, "vibration")}
                h="100%"
              >
                <Text fontSize="xl" fontWeight="bold">Vibration</Text>
                <Text fontSize="2xl" color={getBoxColor(vibration, "vibration") === "red.500" ? "white" : "blue.500"}>
                  {vibration.toFixed(2)} m/s²
                </Text>
              </Box>
            </GridItem>

            <GridItem>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="md"
                bg={getBoxColor(pressure, "pressure")}
                h="100%"
              >
                <Text fontSize="xl" fontWeight="bold">Pressure</Text>
                <Text fontSize="2xl" color={getBoxColor(pressure, "pressure") === "red.500" ? "white" : "blue.500"}>
                  {pressure.toFixed(2)} bar
                </Text>
              </Box>
            </GridItem>
          </Grid>

          {/* Line Chart for Visualizing Data */}
          <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Sensor Data Chart</Text>
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Sensor Data',
                  },
                },
              }}
            />
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
}

export default App;
