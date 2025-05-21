package com.contappa.core.models;

import jakarta.persistence.*;

import java.util.UUID;


@Entity
@Table(name = "bill_items")
public class BillItems {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    



}
