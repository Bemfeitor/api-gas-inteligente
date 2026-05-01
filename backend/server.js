const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.text({ type: '*/*', limit: '32kb' }));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
        fetch: (url, options = {}) => fetch(url, {
            ...options,
            signal: AbortSignal.timeout(15000),
        }),
    },
});

app.get(['/', '/health'], (req, res) => {
    res.json({ status: 'ok', service: 'gas-scale-api' });
});

function parseNumber(value) {
    if (value === undefined || value === null || value === '') return null;
    const normalized = String(value).trim().replace(',', '.');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}

function parseTextPayload(text) {
    const payload = String(text || '').trim().replace(/^\{|\}$/g, '');
    const parts = payload.split(',').map((part) => part.trim());

    if (parts.length !== 3 || parts.some((part) => !part)) {
        return null;
    }

    const [rawWeight, alarm, macAddress] = parts;
    const weight = parseNumber(rawWeight);

    if (weight === null) {
        return null;
    }

    return {
        mac_address: macAddress,
        weight: weight / 100,
        alarm: alarm === '1',
        source: 'text_payload',
    };
}

function parseJsonPayload(text) {
    try {
        const body = JSON.parse(String(text || '{}'));
        const nestedPayload = typeof body.payload === 'string' ? parseTextPayload(body.payload) : null;

        if (nestedPayload) {
            return {
                ...nestedPayload,
                battery: parseNumber(body.battery),
                signal: parseNumber(body.signal),
            };
        }

        const macAddress = body.mac_address || body.mac || body.device || body.device_id;
        const weight = parseNumber(body.weight ?? body.peso);

        if (!macAddress || weight === null) {
            return null;
        }

        return {
            mac_address: String(macAddress).trim(),
            weight,
            battery: parseNumber(body.battery),
            signal: parseNumber(body.signal),
            source: 'json',
        };
    } catch {
        return null;
    }
}

function parseReading(req) {
    const rawBody = typeof req.body === 'string' ? req.body.trim() : '';

    if (!rawBody) {
        return null;
    }

    return parseTextPayload(rawBody) || parseJsonPayload(rawBody);
}

function getRawBody(req) {
    return typeof req.body === 'string' ? req.body.trim() : '';
}

async function findOrCreateDevice(macAddress) {
    const { data: device, error: findError } = await supabase
        .from('devices')
        .select('id')
        .eq('mac_address', macAddress)
        .maybeSingle();

    if (findError) {
        throw findError;
    }

    if (device) {
        return device;
    }

    const { data: newDevice, error: createError } = await supabase
        .from('devices')
        .insert([{ mac_address: macAddress }])
        .select('id')
        .single();

    if (createError) {
        throw createError;
    }

    return newDevice;
}

app.post(['/api/readings', '/api/reading', '/api/payload'], async (req, res) => {
    const rawBody = getRawBody(req);
    console.log(`Received reading payload -> raw: ${rawBody || '<empty>'}`);

    const reading = parseReading(req);

    if (!reading) {
        console.warn('Invalid reading payload:', req.body);
        return res.status(400).json({
            error: 'Invalid payload',
            expected: 'weight,alarm,MAC or JSON with mac_address and weight',
        });
    }

    console.log(
        `Processing reading -> MAC: ${reading.mac_address}, Weight: ${reading.weight}, Alarm: ${reading.alarm === true ? 1 : 0}`
    );

    try {
        console.log(`Finding device -> MAC: ${reading.mac_address}`);
        const device = await findOrCreateDevice(reading.mac_address);
        console.log(`Device ready -> MAC: ${reading.mac_address}, Device ID: ${device.id}`);

        const insertData = {
            device_id: device.id,
            weight: reading.weight,
            battery: reading.battery,
            signal: reading.signal,
        };

        const { error: readingError } = await supabase
            .from('readings')
            .insert([insertData]);

        if (readingError) {
            throw readingError;
        }

        await supabase
            .from('devices')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', device.id);

        console.log(
            `Reading saved -> MAC: ${reading.mac_address}, Weight: ${reading.weight}, Device ID: ${device.id}`
        );

        return res.status(201).json({
            message: 'Reading saved successfully',
            device_id: device.id,
            mac_address: reading.mac_address,
            weight: reading.weight,
        });
    } catch (err) {
        console.error('Error saving reading:', err);
        return res.status(500).json({
            error: 'Internal Server Error',
            details: err.message,
            code: err.code,
        });
    }
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = {
    app,
    parseTextPayload,
    parseJsonPayload,
    parseReading,
    getRawBody,
};
