-- Rate Maintenance Table
CREATE TABLE rates (
    rate_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL,
    item_description TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
 
-- Room Maintenance Table
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL,
    floor INTEGER NOT NULL,
    base_rent DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    type VARCHAR(50),
    reserved BOOLEAN DEFAULT false,
    for_rent BOOLEAN DEFAULT true,
    deposit DECIMAL(10, 2)
);
 
-- Tenant Maintenance Table
CREATE TABLE tenants (
    tenant_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    personal_id VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    room_id INTEGER REFERENCES rooms(room_id),
    start_date DATE,
    end_date DATE
);
 
-- User Authentication Table
CREATE TABLE manager (
    manager_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number NUMBER(12) UNIQUE NOT NULL,
    profile_image 
);
 
-- Check-In Table
CREATE TABLE check_ins (
    check_in_id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(tenant_id),
    room_id INTEGER REFERENCES rooms(room_id),
    move_in_date DATE NOT NULL,
    period_of_stay INTEGER NOT NULL,
    deposit_paid DECIMAL(10, 2) NOT NULL
);
 
-- Check-Out Table
CREATE TABLE check_outs (
    check_out_id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(tenant_id),
    room_id INTEGER REFERENCES rooms(room_id),
    move_out_date DATE NOT NULL,
    deposit_returned DECIMAL(10, 2),
    final_bill DECIMAL(10, 2)
);
 
 
CREATE TABLE room_rates (
    room_id INTEGER NOT NULL REFERENCES rooms(room_id),
    rate_id INTEGER NOT NULL REFERENCES rates(rate_id),
    quantity INTEGER DEFAULT 1, 
    PRIMARY KEY (room_id, rate_id)
);
 
-- Meter_Readings Table
CREATE TABLE meter_readings (
    reading_id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES rooms(room_id),
    water_reading INTEGER NOT NULL,
    electricity_reading INTEGER NOT NULL,
    reading_date DATE NOT NULL
);
 
-- Bills Table
CREATE TABLE bills (
    bill_id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES rooms(room_id),
    water_usage DECIMAL(10, 2), -- calculated water usage
    water_cost DECIMAL(10, 2),
    electricity_usage DECIMAL(10, 2), -- calculated electricity usage
    electricity_cost DECIMAL(10, 2),
    additional_rates_cost DECIMAL(10, 2),
    bill_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) -- total amount calculated
);