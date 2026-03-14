-- Smart Traffic Enforcement and Management Platform
-- Supabase PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Junctions table
CREATE TABLE junctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Traffic logs table
CREATE TABLE traffic_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    junction_id UUID NOT NULL REFERENCES junctions(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cars INTEGER NOT NULL DEFAULT 0,
    bikes INTEGER NOT NULL DEFAULT 0,
    buses INTEGER NOT NULL DEFAULT 0,
    trucks INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    density VARCHAR(10) NOT NULL CHECK (density IN ('Low', 'Medium', 'High')),
    green_time INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Violations table
CREATE TABLE violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    junction_id UUID NOT NULL REFERENCES junctions(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_traffic_logs_junction ON traffic_logs(junction_id);
CREATE INDEX idx_traffic_logs_timestamp ON traffic_logs(timestamp);
CREATE INDEX idx_violations_junction ON violations(junction_id);
CREATE INDEX idx_violations_timestamp ON violations(timestamp);

-- Seed data: sample junctions
INSERT INTO junctions (name, location) VALUES
    ('Junction A', 'Main Street & 1st Avenue'),
    ('Junction B', 'Highway 5 & Oak Road'),
    ('Junction C', 'Park Lane & River Drive');
