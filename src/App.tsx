import React, { useState } from "react";
import { Box, Text, VStack, Heading, Grid, Flex } from "@chakra-ui/react";
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
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Interfaces
interface SensorData {
  temperature: number;
  vibration: number;
  pressure: number;
  humidity: number;
}

interface Machines {
  [key: string]: SensorData;
}

// Données simulées
const machines: Machines = {
  Machine1: { temperature: 70, vibration: 0.1, pressure: 1.2, humidity: 35.0 },
  Machine2: { temperature: 24.0, vibration: 0.2, pressure: 1.3, humidity: 40.0 },
  Machine3: { temperature: 21.0, vibration: 0.15, pressure: 1.1, humidity: 50.0 },
  Machine4: { temperature: 23.5, vibration: 0.05, pressure: 1.4, humidity: 45.0 },
};

// Fonction pour créer les données de graphique en ligne
const createChartData = (label: string, value: number) => ({
  labels: [label],
  datasets: [
    {
      label,
      data: [value],
      fill: false,
      backgroundColor: "rgba(54, 162, 235, 0.8)",
      borderColor: "rgba(54, 162, 235, 1)",
      tension: 0.3,
    },
  ],
});

const HomePage = ({ setSelectedMachine }: { setSelectedMachine: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={5}>
      {Object.entries(machines).map(([name, data]) => (
        <Box
          key={name}
          p={4}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="md"
          cursor="pointer"
          onClick={() => setSelectedMachine(name)}
          _hover={{ bg: "gray.100" }}
        >
          <Text fontSize="xl" fontWeight="bold" mb={2}>{name}</Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={3}>
            <Box>
              <Text fontSize="sm">Temp</Text>
              <Text>{data.temperature.toFixed(1)} °C</Text>
            </Box>
            <Box>
              <Text fontSize="sm">Vibration</Text>
              <Text>{data.vibration.toFixed(2)} m/s²</Text>
            </Box>
            <Box>
              <Text fontSize="sm">Pression</Text>
              <Text>{data.pressure.toFixed(2)} bar</Text>
            </Box>
            <Box>
              <Text fontSize="sm">Humidité</Text>
              <Text>{data.humidity.toFixed(2)} %</Text>
            </Box>
          </Grid>
        </Box>
      ))}
    </Grid>
  );
};

const MachinePage = ({ machineName }: { machineName: string }) => {
  const sensorData = machines[machineName];

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={5}>
      <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Text fontSize="xl" mb={2}>Température</Text>
        <Line data={createChartData("Température", sensorData.temperature)} />
      </Box>
      <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Text fontSize="xl" mb={2}>Vibration</Text>
        <Line data={createChartData("Vibration", sensorData.vibration)} />
      </Box>
      <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Text fontSize="xl" mb={2}>Pression</Text>
        <Line data={createChartData("Pression", sensorData.pressure)} />
      </Box>
      <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Text fontSize="xl" mb={2}>Humidité</Text>
        <Line data={createChartData("Humidité", sensorData.humidity)} />
      </Box>
    </Grid>
  );
};

const App = () => {
  const [selectedMachine, setSelectedMachine] = useState<string>("home");

  return (
    <Router>
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
          gap={2}
        >
          <Heading size="lg" mt={1.5}>Machine ID</Heading>

          <Link to="/">
            <Text
              fontSize="xl"
              mt={10}
              cursor="pointer"
              fontWeight={selectedMachine === "home" ? "bold" : "normal"}
              onClick={() => setSelectedMachine("home")}
            >
              Accueil
            </Text>
          </Link>

          {Object.keys(machines).map((machine) => (
            <Link to={`/${machine}`} key={machine}>
              <Text
                fontSize="xl"
                mt={6}
                cursor="pointer"
                fontWeight={machine === selectedMachine ? "bold" : "normal"}
                onClick={() => setSelectedMachine(machine)}
              >
                {machine}
              </Text>
            </Link>
          ))}
        </Box>

        {/* Main Content */}
        <Box flex="1" p={5}>
          <VStack gap={5} align="stretch">
            <Heading>
              {selectedMachine === "home" ? "Vue Globale des Machines" : `Dashboard - ${selectedMachine}`}
            </Heading>

            <Routes>
              <Route path="/" element={<HomePage setSelectedMachine={setSelectedMachine} />} />
              {Object.keys(machines).map((machine) => (
                <Route key={machine} path={`/${machine}`} element={<MachinePage machineName={machine} />} />
              ))}
            </Routes>
          </VStack>
        </Box>
      </Flex>
    </Router>
  );
};

export default App;
