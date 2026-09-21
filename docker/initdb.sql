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
    number INT NOT NULL,
    name VARCHAR(60),
    capacity INT NOT NULL DEFAULT 4
);

CREATE TABLE bills (
    id UUID PRIMARY KEY,
    table_id UUID REFERENCES tables(id),
    amount NUMERIC(10,2) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    paid BOOLEAN DEFAULT FALSE NOT NULL,
    guests INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bill_items (
    bill_id UUID REFERENCES bills(id),
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
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
('11111111-1111-1111-1111-111111111111', 'Coffee',    'Espresso bar'),
('22222222-2222-2222-2222-222222222222', 'Breakfast', 'Served until noon'),
('33333333-3333-3333-3333-333333333333', 'Kitchen',   'Plates from the line'),
('44444444-4444-4444-4444-444444444444', 'Pastry',    'Baked in house'),
('55555555-5555-5555-5555-555555555555', 'Cold Bar',  'Juices, sodas and beer');

INSERT INTO products (id, name, price, category_id, image_url) VALUES
('a0000001-0000-4000-8000-000000000001', 'Espresso',          2.60, '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80'),
('a0000002-0000-4000-8000-000000000002', 'Cortado',           3.20, '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80'),
('a0000003-0000-4000-8000-000000000003', 'Flat White',        4.20, '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=80'),
('a0000004-0000-4000-8000-000000000004', 'Cappuccino',        4.00, '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&q=80'),
('a0000005-0000-4000-8000-000000000005', 'Latte',             4.30, '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&q=80'),
('a0000006-0000-4000-8000-000000000006', 'Cold Brew',         4.80, '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80'),
('a0000007-0000-4000-8000-000000000007', 'Mocha',             4.60, '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&q=80'),
('a0000008-0000-4000-8000-000000000008', 'Matcha Latte',      4.90, '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80'),

('b0000001-0000-4000-8000-000000000001', 'Avocado Toast',     9.50, '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&q=80'),
('b0000002-0000-4000-8000-000000000002', 'Eggs Benedict',    12.00, '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&q=80'),
('b0000003-0000-4000-8000-000000000003', 'Pancake Stack',    10.50, '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80'),
('b0000004-0000-4000-8000-000000000004', 'Granola Bowl',      8.00, '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&q=80'),
('b0000005-0000-4000-8000-000000000005', 'Croissant & Jam',   5.50, '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80'),

('c0000001-0000-4000-8000-000000000001', 'Smash Burger',     14.50, '33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80'),
('c0000002-0000-4000-8000-000000000002', 'Truffle Fries',     6.50, '33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80'),
('c0000003-0000-4000-8000-000000000003', 'Margherita Pizza', 13.00, '33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80'),
('c0000004-0000-4000-8000-000000000004', 'Caesar Salad',     11.00, '33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=80'),
('c0000005-0000-4000-8000-000000000005', 'Club Sandwich',    12.50, '33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80'),
('c0000006-0000-4000-8000-000000000006', 'Fish & Chips',     15.00, '33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=600&q=80'),
('c0000007-0000-4000-8000-000000000007', 'Tomato Soup',       7.50, '33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80'),

('d0000001-0000-4000-8000-000000000001', 'Cheesecake',        6.80, '44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80'),
('d0000002-0000-4000-8000-000000000002', 'Carrot Cake',       6.20, '44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80'),
('d0000003-0000-4000-8000-000000000003', 'Chocolate Brownie', 5.50, '44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80'),
('d0000004-0000-4000-8000-000000000004', 'Cinnamon Roll',     4.80, '44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&q=80'),
('d0000005-0000-4000-8000-000000000005', 'Lemon Tart',        6.00, '44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80'),

('e0000001-0000-4000-8000-000000000001', 'Orange Juice',      4.50, '55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80'),
('e0000002-0000-4000-8000-000000000002', 'Lemonade',          4.00, '55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80'),
('e0000003-0000-4000-8000-000000000003', 'Sparkling Water',   3.00, '55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&q=80'),
('e0000004-0000-4000-8000-000000000004', 'Craft Lager',       6.50, '55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&q=80'),
('e0000005-0000-4000-8000-000000000005', 'Iced Tea',          3.80, '55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=600&q=80');

INSERT INTO tables (id, number, name, capacity) VALUES
('d0000000-0000-4000-8000-000000000001', 1, 'Window 1',  2),
('d0000000-0000-4000-8000-000000000002', 2, 'Window 2',  2),
('d0000000-0000-4000-8000-000000000003', 3, 'Main 3',    4),
('d0000000-0000-4000-8000-000000000004', 4, 'Main 4',    4),
('d0000000-0000-4000-8000-000000000005', 5, 'Main 5',    6),
('d0000000-0000-4000-8000-000000000006', 6, 'Booth 6',   4),
('d0000000-0000-4000-8000-000000000007', 7, 'Booth 7',   4),
('d0000000-0000-4000-8000-000000000008', 8, 'Bar 8',     2),
('d0000000-0000-4000-8000-000000000009', 9, 'Terrace 9', 6),
('d0000000-0000-4000-8000-00000000001a', 10, 'Terrace 10', 8),
('d0000000-0000-4000-8000-00000000001b', 11, 'Garden 11', 4),
('d0000000-0000-4000-8000-00000000001c', 12, 'Garden 12', 6);

INSERT INTO bills (id, table_id, amount, date, status, paid, guests, created_at, updated_at) VALUES
('f0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000003', 41.50, CURRENT_DATE, 'open', FALSE, 4, NOW() - INTERVAL '98 minutes', NOW() - INTERVAL '41 minutes'),
('f0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000005', 31.10, CURRENT_DATE, 'open', FALSE, 5, NOW() - INTERVAL '62 minutes', NOW() - INTERVAL '18 minutes'),
('f0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000008', 7.40,  CURRENT_DATE, 'open', FALSE, 2, NOW() - INTERVAL '9 minutes',  NOW() - INTERVAL '9 minutes'),
('f0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-00000000001a', 58.80, CURRENT_DATE, 'open', FALSE, 7, NOW() - INTERVAL '35 minutes', NOW() - INTERVAL '6 minutes'),
('f0000000-0000-4000-8000-000000000005', 'd0000000-0000-4000-8000-000000000007', 20.30, CURRENT_DATE, 'open', FALSE, 3, NOW() - INTERVAL '74 minutes', NOW() - INTERVAL '52 minutes'),
('f0000000-0000-4000-8000-000000000006', 'd0000000-0000-4000-8000-000000000001', 10.30, CURRENT_DATE, 'open', FALSE, 2, NOW() - INTERVAL '21 minutes', NOW() - INTERVAL '14 minutes');

INSERT INTO bill_items (bill_id, product_id, quantity, unit_price) VALUES
('f0000000-0000-4000-8000-000000000001', 'c0000001-0000-4000-8000-000000000001', 2, 14.50),
('f0000000-0000-4000-8000-000000000001', 'c0000002-0000-4000-8000-000000000002', 1,  6.50),
('f0000000-0000-4000-8000-000000000001', 'e0000003-0000-4000-8000-000000000003', 2,  3.00),

('f0000000-0000-4000-8000-000000000002', 'c0000003-0000-4000-8000-000000000003', 1, 13.00),
('f0000000-0000-4000-8000-000000000002', 'c0000004-0000-4000-8000-000000000004', 1, 11.00),
('f0000000-0000-4000-8000-000000000002', 'e0000001-0000-4000-8000-000000000001', 1,  4.50),
('f0000000-0000-4000-8000-000000000002', 'a0000001-0000-4000-8000-000000000001', 1,  2.60),

('f0000000-0000-4000-8000-000000000003', 'a0000003-0000-4000-8000-000000000003', 1,  4.20),
('f0000000-0000-4000-8000-000000000003', 'a0000002-0000-4000-8000-000000000002', 1,  3.20),

('f0000000-0000-4000-8000-000000000004', 'c0000006-0000-4000-8000-000000000006', 2, 15.00),
('f0000000-0000-4000-8000-000000000004', 'c0000005-0000-4000-8000-000000000005', 1, 12.50),
('f0000000-0000-4000-8000-000000000004', 'e0000004-0000-4000-8000-000000000004', 1,  6.50),
('f0000000-0000-4000-8000-000000000004', 'd0000003-0000-4000-8000-000000000003', 1,  5.50),
('f0000000-0000-4000-8000-000000000004', 'a0000005-0000-4000-8000-000000000005', 1,  4.30),

('f0000000-0000-4000-8000-000000000005', 'b0000001-0000-4000-8000-000000000001', 1,  9.50),
('f0000000-0000-4000-8000-000000000005', 'd0000001-0000-4000-8000-000000000001', 1,  6.80),
('f0000000-0000-4000-8000-000000000005', 'a0000004-0000-4000-8000-000000000004', 1,  4.00),

('f0000000-0000-4000-8000-000000000006', 'b0000005-0000-4000-8000-000000000005', 1,  5.50),
('f0000000-0000-4000-8000-000000000006', 'a0000006-0000-4000-8000-000000000006', 1,  4.80);

DO $$
DECLARE
  minutes_ago INT[] := ARRAY[
    14, 22, 31, 38, 47, 55, 63, 71, 78, 86, 95, 104, 112, 118, 126, 133, 139, 146, 152, 158,
    165, 171, 178, 186, 195, 207, 221, 236, 252, 270, 291, 315, 342, 371, 403, 438, 476, 517
  ];
  product_ids UUID[];
  table_ids UUID[];
  bill_id UUID;
  opened TIMESTAMPTZ;
  item_count INT;
  picked UUID;
  quantity INT;
  price NUMERIC(10,2);
  total NUMERIC(10,2);
BEGIN
  SELECT array_agg(id ORDER BY id) INTO product_ids FROM products;
  SELECT array_agg(id ORDER BY number) INTO table_ids FROM tables;

  FOR i IN 1..array_length(minutes_ago, 1) LOOP
    bill_id := gen_random_uuid();
    opened := NOW() - make_interval(mins => minutes_ago[i]);
    item_count := 2 + (i % 3);
    total := 0;

    INSERT INTO bills (id, table_id, amount, date, status, paid, guests, created_at, updated_at)
    VALUES (
      bill_id,
      table_ids[1 + (i % array_length(table_ids, 1))],
      0,
      CURRENT_DATE,
      'closed',
      TRUE,
      1 + (i % 4),
      opened - INTERVAL '50 minutes',
      opened
    );

    FOR k IN 0..item_count - 1 LOOP
      picked := product_ids[1 + ((i * 7 + k * 11) % array_length(product_ids, 1))];
      quantity := 1 + ((i + k) % 2);
      SELECT p.price INTO price FROM products p WHERE p.id = picked;

      INSERT INTO bill_items (bill_id, product_id, quantity, unit_price)
      VALUES (bill_id, picked, quantity, price);

      total := total + price * quantity;
    END LOOP;

    UPDATE bills SET amount = total, updated_at = opened WHERE id = bill_id;
  END LOOP;
END $$;
