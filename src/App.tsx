import React, { useState, useEffect } from "react";
import { Box, Text, VStack, Heading, Grid, GridItem, Flex } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Function to determine the box color based on value thresholds
const getBoxColor = (value: number, type: "temperature" | "vibration" | "pressure") => {
  if (type === "temperature" && value > 60) return "red.500";
  if (type === "vibration" && value > 5) return "red.500";
  if (type === "pressure" && value > 2) return "red.500";
  return "white"; // Default color for normal values
};

function App() {
  // State for real-time values
  const [temperature, setTemperature] = useState(22.5);
  const [vibration, setVibration] = useState(0.1);
  const [pressure, setPressure] = useState(1.2);

  // Chart data that links to the real-time values
  const [chartData, setChartData] = useState({
    labels: ["Temperature", "Vibration", "Pressure"],
    datasets: [
      {
        label: "Sensor Values",
        data: [temperature, vibration, pressure], // Initial static values
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  });

  // Simulate API call to get sensor data
  const fetchSensorData = async () => {
    // Replace this with your API call to fetch real data from the sensor
    try {
      const response = await fetch('http://your-sensor-api-url.com/data');
      const data = await response.json();
      
      // Assuming the API returns an object like: { temperature, vibration, pressure }
      setTemperature(data.temperature);
      setVibration(data.vibration);
      setPressure(data.pressure);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  // Fetch data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSensorData();
    }, 3000); // Adjust time interval as needed

    return () => clearInterval(interval); // Clean up on component unmount
  }, []); // Empty array ensures this effect only runs once when the component mounts

  // Update chart data when sensor values change
  useEffect(() => {
    setChartData({
      labels: ["Temperature", "Vibration", "Pressure"],
      datasets: [
        {
          label: "Sensor Values",
          data: [temperature, vibration, pressure],
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    });
  }, [temperature, vibration, pressure]); // Re-run effect when values change

  return (
    <Flex minHeight="100vh">
      {/* Sidebar */}
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

      {/* Main content area */}
      <Box flex="1" p={5}>
        <VStack gap={5} align="stretch">
          <Heading>Dashboard</Heading>

          {/* Grid to display values */}
          <Grid templateColumns="repeat(3, 1fr)" gap={5}>
            {/* Temperature */}
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
                <Text fontSize="2xl" color={getBoxColor(temperature, "temperature") === "red.500" ? "white" : "blue.500"}>{temperature.toFixed(2)} °C</Text>
              </Box>
            </GridItem>

            {/* Vibration */}
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
                <Text fontSize="2xl" color={getBoxColor(vibration, "vibration") === "red.500" ? "white" : "blue.500"}>{vibration.toFixed(2)} m/s²</Text>
              </Box>
            </GridItem>

            {/* Pressure */}
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
                <Text fontSize="2xl" color={getBoxColor(pressure, "pressure") === "red.500" ? "white" : "blue.500"}>{pressure.toFixed(2)} bar</Text>
              </Box>
            </GridItem>
          </Grid>

          {/* Bar Chart for Visualizing Data */}
          <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Sensor Data Chart</Text>
            <Bar data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Sensor Data' } } }} />
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
}

export default App;
