export const sellerSwagger = {
  "/seller/dashboard": {
    "get": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "Shop Performance KPI & Dashboard Overview",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "responses": {
        "200": {
          "description": "Shop metrics, inventory count, enquiries, and repair status breakdown."
        }
      }
    }
  },
  "/seller/products": {
    "get": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "List Shop Catalog Products with Stock & Filters",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "page",
          "in": "query",
          "schema": {
            "type": "integer",
            "default": 1
          }
        },
        {
          "name": "limit",
          "in": "query",
          "schema": {
            "type": "integer",
            "default": 10
          }
        },
        {
          "name": "search",
          "in": "query",
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "status",
          "in": "query",
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "categoryId",
          "in": "query",
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Paginated products list."
        }
      }
    },
    "post": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "Add New Product to Shop Catalogue",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "categoryId",
                "name",
                "pricePaise"
              ],
              "properties": {
                "categoryId": {
                  "type": "string",
                  "example": "cat-uuid-case"
                },
                "name": {
                  "type": "string",
                  "example": "iPhone 15 Matte Finish Shield Case"
                },
                "brand": {
                  "type": "string",
                  "example": "Spigen"
                },
                "sku": {
                  "type": "string",
                  "example": "SPG-IP15-MBL"
                },
                "modelCompatibility": {
                  "type": "string",
                  "example": "iPhone 15"
                },
                "conditionState": {
                  "type": "string",
                  "default": "New"
                },
                "warranty": {
                  "type": "string",
                  "example": "6 Months Brand Warranty"
                },
                "pricePaise": {
                  "type": "integer",
                  "description": "Price in paise (₹899.00 = 89900)",
                  "example": 89900
                },
                "compareAtPricePaise": {
                  "type": "integer",
                  "example": 129900
                },
                "discountPercent": {
                  "type": "integer",
                  "example": 30
                },
                "stock": {
                  "type": "integer",
                  "example": 14
                },
                "status": {
                  "type": "string",
                  "enum": [
                    "ACTIVE",
                    "DRAFT",
                    "OUT_OF_STOCK"
                  ],
                  "default": "ACTIVE"
                },
                "description": {
                  "type": "string",
                  "example": "Durable matte finish case with responsive tactile buttons."
                },
                "images": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": [
                      "url"
                    ],
                    "properties": {
                      "url": {
                        "type": "string",
                        "example": "https://images.unsplash.com/photo-1603302576837-37561b2e2302"
                      },
                      "altText": {
                        "type": "string",
                        "example": "Shield Case Angle"
                      },
                      "position": {
                        "type": "integer",
                        "default": 0
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Product created successfully."
        }
      }
    }
  },
  "/seller/products/{productId}": {
    "get": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "Get Product Details by ID",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "productId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Product details."
        }
      }
    },
    "patch": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "Update Product Details",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "productId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Product updated."
        }
      }
    },
    "delete": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "Delete Product from Catalogue",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "productId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Product deleted."
        }
      }
    }
  },
  "/seller/shop": {
    "get": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "Get Storefront Profile",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "responses": {
        "200": {
          "description": "Store details."
        }
      }
    },
    "patch": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "Update Storefront Profile, WhatsApp Number & Location Coordinates",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "responses": {
        "200": {
          "description": "Store profile updated."
        }
      }
    }
  },
  "/seller/enquiries": {
    "get": {
      "tags": [
        "3. Tier 2: Super Seller (Shop Owner)"
      ],
      "summary": "List WhatsApp Lead Enquiries for Shop",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "responses": {
        "200": {
          "description": "WhatsApp enquiries list."
        }
      }
    }
  },
  "/seller/admin/customers": {
    "get": {
      "tags": [
        "4. Tier 3: Seller Admin (Store Staff)"
      ],
      "summary": "List Walk-In Local Customers",
      "description": "Returns walk-in customers logged under this store.",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "search",
          "in": "query",
          "schema": {
            "type": "string"
          },
          "description": "Search by customer name, phone, or email"
        },
        {
          "name": "page",
          "in": "query",
          "schema": {
            "type": "integer",
            "default": 1
          }
        },
        {
          "name": "limit",
          "in": "query",
          "schema": {
            "type": "integer",
            "default": 20
          }
        }
      ],
      "responses": {
        "200": {
          "description": "List of customers registered for this shop."
        }
      }
    },
    "post": {
      "tags": [
        "4. Tier 3: Seller Admin (Store Staff)"
      ],
      "summary": "Log / Register Walk-In Local Customer",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "name",
                "phone"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "example": "Vijay Sundaram"
                },
                "phone": {
                  "type": "string",
                  "example": "9812345678"
                },
                "email": {
                  "type": "string",
                  "example": "vijay@example.com"
                },
                "address": {
                  "type": "string",
                  "example": "MG Road, Bangalore"
                },
                "notes": {
                  "type": "string",
                  "example": "Prefers OEM parts for iPhone 14 Pro"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Customer logged successfully."
        }
      }
    }
  }
};
