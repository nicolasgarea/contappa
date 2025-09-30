package com.contappa.core.dto;

import java.util.UUID;

public class UpdateCategoryRequestDTO {
    private String name;
    private String description;
    private UUID categoryId;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }
}
