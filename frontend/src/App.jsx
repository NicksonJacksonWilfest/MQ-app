import { useState } from 'react';
import axios from 'axios';

function App() {
    const [task, setTask] = useState('');
    const [imageId, setImageId] = useState('');

    const handleSend = async () => {
        if (!task || !imageId) return;

        try {
            const res = await axios.post('http://localhost:4000/send', {
                task,
                imageId: parseInt(imageId),
            });
            alert('✅ Message sent: ' + JSON.stringify(res.data.message));
        } catch (err) {
            alert('❌ Error sending message');
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <h1>🐇 RabbitMQ Message Sender</h1>
            <input
                type="text"
                placeholder="Task (e.g. resize)"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                style={{ marginRight: 10 }}
            />
            <input
                type="number"
                placeholder="Image ID"
                value={imageId}
                onChange={(e) => setImageId(e.target.value)}
                style={{ marginRight: 10 }}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default App;
