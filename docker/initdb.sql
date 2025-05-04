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
    amount DECIMAL,
    date DATE,
    table_id UUID REFERENCES tables(id)
);

CREATE TABLE bill_items (
    bill_id UUID REFERENCES bills(id),
    product_id UUID REFERENCES products(id),
    quantity INT,
    unit_price DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    status VARCHAR(50),
    PRIMARY KEY(bill_id, product_id)
);