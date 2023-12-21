
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('myChart').getContext('2d');
    const simulateButton = document.getElementById('simulate-button');
    const initialVelocityInput = document.getElementById('initial-velocity');
    const angleInput = document.getElementById('angle');
    const gravityInput = document.getElementById('gravity');
    const initialHeightInput = document.getElementById('initial-height');
    const chartContainer = document.querySelector('.simulation-container');

    const canvas = document.getElementById('myChart');
    canvas.width = window.innerWidth * 0.8; // Adjust the multiplier as needed
    canvas.height = window.innerHeight * 0.6; // Adjust the multiplier as needed


    const simulationData = {
        datasets: [{
            label: 'lintasan peluru',
            data: [],
            borderColor: 'rgba(52, 73, 94, 1)',
            borderWidth: 2,
            fill: false,
        }],
    };

    const simulationOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: 'Horizontal Distance (m)',
                },
                
            },
            y: {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Vertical Distance (m)',
                },
            },
        },

        animation: {
            duration: 2000, // Set animation duration in milliseconds
        },
        
    };

    const trajectoryChart = new Chart(ctx, {
        type: 'line',
        data: simulationData,
        options: simulationOptions,
    });

    chartContainer.style.height = '400px';

    simulateButton.addEventListener('click', simulateProjectile);

    function simulateProjectile() {
        const initialVelocity = parseFloat(initialVelocityInput.value) || 0;
        const angle = parseFloat(angleInput.value) || 0;
        const gravity = parseFloat(gravityInput.value) || 0;
        const initialHeight = parseFloat(initialHeightInput.value) || 0;
    
        const simulationResult = runProjectileSimulation(initialVelocity, angle, gravity, initialHeight);
    
        // Update the chart with the simulation result
        updateChart(simulationResult);
    }
    
    function runProjectileSimulation(initialVelocity, angle, gravity, initialHeight) {
        const result = [];
        const totalTime = 10; // Set a fixed total simulation time (adjust as needed)
        const interval = 0.1;
    
        for (let t = 0; t <= totalTime; t += interval) {
            const position = calculateProjectilePosition(initialVelocity, angle, gravity, initialHeight, t);
    
            // Stop generating points if the y-coordinate is negative (below the y-axis)
            if (position.y < 0) {
                break;
            }
    
            result.push(position);
        }
    
        return result;
    }

    function calculateProjectilePosition(initialVelocity, angle, gravity, initialHeight, time) {
        // Convert angle to radians
        const radians = angle * Math.PI / 180;
        

        // Horizontal and vertical velocities
        const Vtx = initialVelocity * Math.cos(radians);
        const Vty = initialVelocity * Math.sin(radians);

        // Calculate the time to reach the maximum height
        const timeToMaxHeight = Vty / gravity;
    
        // Calculate the maximum height
        const maxHeight = initialHeight + Vty * timeToMaxHeight - 0.5 * gravity * timeToMaxHeight ** 2;
    
        // Calculate positions
        const positionX = Vtx * time;
    
        // Determine the position based on time
        let positionY;
    
        if (time <= timeToMaxHeight) {
            // Upward vertical movement equation
            positionY = initialHeight + Vty * time - 0.5 * gravity * time ** 2;
        } else {
            // Free fall motion equation from the peak
            positionY = maxHeight - 0.5 * gravity * (time - timeToMaxHeight) ** 2;
        }
    
        return { x: positionX, y: positionY };
    }

    function updateChart(data) {
        // Clear existing data
        simulationData.datasets[0].data = [];

        // Add new data
        simulationData.datasets[0].data = data;

        // Update the chart
        trajectoryChart.update();
    }
});
