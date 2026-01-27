
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Health Check
app.get('/', (req, res) => {
    res.send('Gas Scale API is running');
});

// Post Reading Endpoint
app.post(['/api/readings', '/api/reading'], async (req, res) => {
    const { mac_address, weight, battery, signal } = req.body;

    if (!mac_address || weight === undefined) {
        return res.status(400).json({ error: 'Missing mac_address or weight' });
    }

    try {
        // 1. Check if device exists, if not create it (upsert check)
        // For simplicity, we assume the device should be registered or we auto-register it.
        // Let's Find the device ID first
        let { data: device, error: deviceError } = await supabase
            .from('devices')
            .select('id')
            .eq('mac_address', mac_address)
            .single();

        if (!device) {
            // Auto-register new device found
            const { data: newDevice, error: createError } = await supabase
                .from('devices')
                .insert([{ mac_address }])
                .select()
                .single();

            if (createError) throw createError;
            device = newDevice;
        }

        // 2. Insert reading
        const { error: readingError } = await supabase
            .from('readings')
            .insert([
                {
                    device_id: device.id,
                    weight: parseFloat(weight),
                    battery: battery ? parseFloat(battery) : null,
                    signal: signal ? parseFloat(signal) : null,
                },
            ]);

        if (readingError) throw readingError;

        // 3. Update last_seen in devices
        await supabase
            .from('devices')
            .update({ updated_at: new Date() })
            .eq('id', device.id);

        res.status(201).json({ message: 'Reading saved successfully', device_id: device.id });

    } catch (err) {
        console.error('Error saving reading:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
