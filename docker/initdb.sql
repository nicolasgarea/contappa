CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id),
    image_url VARCHAR(255)
);

CREATE TABLE tables (
    id UUID PRIMARY KEY,
    number INT NOT NULL
);

CREATE TABLE bills (
    id UUID PRIMARY KEY,
    table_id UUID REFERENCES tables(id),
    amount NUMERIC(10,2) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bill_items (
    bill_id UUID REFERENCES bills(id),
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(bill_id, product_id)
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bills
BEFORE UPDATE ON bills
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_bill_items
BEFORE UPDATE ON bill_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

INSERT INTO categories (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Beverages', 'Drinks and soft drinks'),
('22222222-2222-2222-2222-222222222222', 'Food', 'Main dishes and snacks'),
('33333333-3333-3333-3333-333333333333', 'Desserts', 'Sweet treats');

INSERT INTO products (id, name, price, category_id, image_url) VALUES
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Coffee', 2.50, '11111111-1111-1111-1111-111111111111', NULL),
('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Tea', 2.00, '11111111-1111-1111-1111-111111111111', NULL),
('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Burger', 8.50, '22222222-2222-2222-2222-222222222222', NULL),
('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Fries', 3.00, '22222222-2222-2222-2222-222222222222', NULL),
('ccccccc1-cccc-cccc-cccc-ccccccccccc1', 'Ice Cream', 4.50, '33333333-3333-3333-3333-333333333333', NULL);

INSERT INTO tables (id, number) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 1),
('dddddddd-dddd-dddd-dddd-ddddddddddde', 2),
('dddddddd-dddd-dddd-dddd-dddddddddddf', 3),
('dddddddd-dddd-dddd-dddd-ddddddddddd0', 4);

INSERT INTO bills (id, table_id, amount, date, status) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 10.50, '2025-10-28', 'open'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeef', 'dddddddd-dddd-dddd-dddd-ddddddddddde', 8.00, '2025-10-28', 'open');

INSERT INTO bill_items (bill_id, product_id, quantity, unit_price) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 2, 2.50),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 2, 3.00),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeef', 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 1, 8.50);
