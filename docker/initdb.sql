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