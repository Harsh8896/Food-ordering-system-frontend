import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const WeeklyUserChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/weekly_user_registrations/')
            .then(res => res.json())
            .then(setData);
    }, []);

    return (
        <div className="card p-3 shadow">
            <h5 className="text-info">Weekly New Users</h5>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                        type="monotone" 
                        dataKey="new_users" 
                        stroke="#0dcaf0" 
                        strokeWidth={3} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeeklyUserChart;