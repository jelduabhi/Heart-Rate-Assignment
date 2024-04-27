const fs = require('fs');

// Read input data from JSON file
const inputData = JSON.parse(fs.readFileSync('heartrate.json'));

// Function to calculate median of an array
const calculateMedian = (arr) => {
    const sortedArr = arr.sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    if (sortedArr.length % 2 === 0) {
        return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
    } else {
        return sortedArr[mid];
    }
};

// Group measurements by date
const groupedData = inputData.reduce((acc, curr) => {
    const date = curr.timestamps.startTime.split('T')[0];
    if (!acc[date]) {
        acc[date] = [];
    }
    acc[date].push(curr);
    return acc;
}, {});

// Calculate statistics for each day
const output = Object.keys(groupedData).map(date => {
    const measurements = groupedData[date];
    const beatsPerMinuteArray = measurements.map(data => data.beatsPerMinute);
    const min = Math.min(...beatsPerMinuteArray);
    const max = Math.max(...beatsPerMinuteArray);
    const median = calculateMedian(beatsPerMinuteArray);
    const latestDataTimestamp = measurements[measurements.length - 1].timestamps.endTime;
    return {
        date,
        min,
        max,
        median,
        latestDataTimestamp
    };
});

// Write output to JSON file
fs.writeFileSync('output.json', JSON.stringify(output, null, 2));