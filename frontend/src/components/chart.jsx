import React from 'react';
import { ResponsiveVoronoi } from '@nivo/voronoi';

const data = Array.from({ length: 80 }, (_, i) => ({
    id: `point-${i}`,
    x: Math.random() * 800,
    y: Math.random() * 800,
    value: Math.floor(Math.random() * 50 - 25) // values from -25 to 25
}));

const colors = [
    '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
    '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'
];

const getColor = value => {
    if (value <= -20) return colors[0];
    if (value <= -15) return colors[1];
    if (value <= -10) return colors[2];
    if (value <= -5) return colors[3];
    if (value < 0) return colors[4];
    if (value === 0) return colors[5];
    if (value <= 5) return colors[6];
    if (value <= 10) return colors[7];
    if (value <= 15) return colors[8];
    if (value <= 20) return colors[9];
    return colors[10];
};

const VoronoiChart = () => {
    return (
        <div style={{ width: '800px', height: '800px', borderRadius: '50%', overflow: 'hidden', border: '4px solid gray' }}>
            <ResponsiveVoronoi
                data={data}
                xDomain={[0, 800]}
                yDomain={[0, 800]}
                enableLinks={false}
                enablePoints={false}
                cellLineWidth={2}
                cellLineColor="#ffffff"
                cellColor={d => getColor(d.data.value)}
            />
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <span>ფასების პროცენტული ცვლილება</span>
            </div>
        </div>
    );
};

export default VoronoiChart;
