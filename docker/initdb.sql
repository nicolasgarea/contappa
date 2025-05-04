CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    price NUMERIC
);

CREATE TABLE tables (
    id UUID PRIMARY KEY,
    number INT
);

CREATE TABLE bills (
    id UUID PRIMARY KEY,
    table_id UUID REFERENCES tables(id),
    amount DECIMAL,
    date DATE,
    status VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE bill_items (
    bill_id UUID REFERENCES bills(id),
    product_id UUID REFERENCES products(id),
    quantity INT,
    unit_price DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY(bill_id, product_id)
);
