package com.contappa.core.models;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TableTest {

    @Test
    public void testTableConstructor() {
        Table table = new Table();
        assertNotNull(table);
    }
    @Test
    public void testTableConstructorWithParameter() {
        Table table = new Table(5);
        assertNotNull(table, "Is null");
        assertEquals(5,table.getNumber());
    }

}
