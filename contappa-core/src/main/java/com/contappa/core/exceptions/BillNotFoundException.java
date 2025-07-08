package com.contappa.core.exceptions;

public class BillNotFoundException extends RuntimeException{
    public BillNotFoundException(String message){
        super(message);
    }
}
