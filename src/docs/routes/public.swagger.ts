export const publicSwagger = {
  "/public/products/nearest": {
    "get": {
      "tags": [
        "5. Tier 4: Client User / Visitor (Zero Registration)"
      ],
      "summary": "Nearest Product Discovery (Haversine Geo-Search)",
      "description": "Finds products strictly ordered nearest-first from active and verified stores using spherical Haversine distance calculations. No login or signup required.",
      "parameters": [
        {
          "name": "lat",
          "in": "query",
          "required": true,
          "schema": {
            "type": "number"
          },
          "example": 12.9716,
          "description": "Client live GPS latitude"
        },
        {
          "name": "lng",
          "in": "query",
          "required": true,
          "schema": {
            "type": "number"
          },
          "example": 77.5946,
          "description": "Client live GPS longitude"
        },
        {
          "name": "radiusMeters",
          "in": "query",
          "schema": {
            "type": "integer",
            "default": 2500,
            "minimum": 500,
            "maximum": 50000
          },
          "description": "Search radius in meters (500m to 10km)"
        },
        {
          "name": "categoryId",
          "in": "query",
          "schema": {
            "type": "string"
          },
          "description": "Filter by category ID"
        },
        {
          "name": "q",
          "in": "query",
          "schema": {
            "type": "string"
          },
          "description": "Search keyword by product name or brand"
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
            "default": 50
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Nearest products sorted nearest-first.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "data": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/NearestProductItem"
                    }
                  },
                  "meta": {
                    "type": "object",
                    "properties": {
                      "page": {
                        "type": "integer",
                        "example": 1
                      },
                      "limit": {
                        "type": "integer",
                        "example": 50
                      },
                      "total": {
                        "type": "integer",
                        "example": 8
                      },
                      "radiusMeters": {
                        "type": "integer",
                        "example": 2500
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/shops/nearby": {
    "get": {
      "tags": [
        "5. Tier 4: Client User / Visitor (Zero Registration)"
      ],
      "summary": "Nearby Repair & Accessories Storefronts",
      "description": "Returns nearest verified shops with live GPS coordinates, distance in meters/km, and top products.",
      "parameters": [
        {
          "name": "lat",
          "in": "query",
          "required": true,
          "schema": {
            "type": "number"
          },
          "example": 12.9716
        },
        {
          "name": "lng",
          "in": "query",
          "required": true,
          "schema": {
            "type": "number"
          },
          "example": 77.5946
        },
        {
          "name": "radiusMeters",
          "in": "query",
          "schema": {
            "type": "integer",
            "default": 5000
          }
        },
        {
          "name": "search",
          "in": "query",
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Nearby shops list with computed distance."
        }
      }
    }
  },
  "/enquiries": {
    "post": {
      "tags": [
        "5. Tier 4: Client User / Visitor (Zero Registration)"
      ],
      "summary": "Direct WhatsApp Enquiry (Zero-Auth Lead Generation)",
      "description": "Initiates a pre-filled WhatsApp click-to-chat link directly to the store owner and logs the lead.",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "shopId",
                "customerName",
                "customerPhone",
                "message"
              ],
              "properties": {
                "shopId": {
                  "type": "string",
                  "example": "shop-uuid-001"
                },
                "productId": {
                  "type": "string",
                  "example": "prod-101"
                },
                "customerName": {
                  "type": "string",
                  "example": "Suresh Raina"
                },
                "customerPhone": {
                  "type": "string",
                  "example": "9888877777"
                },
                "message": {
                  "type": "string",
                  "example": "Hi, do you have this in matte black color in stock today?"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Enquiry lead recorded and WhatsApp URL returned.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "data": {
                    "type": "object",
                    "properties": {
                      "enquiryId": {
                        "type": "string",
                        "example": "enq-909"
                      },
                      "whatsappUrl": {
                        "type": "string",
                        "example": "https://wa.me/919845012345?text=Hi%20Pooja%20Mobile%20Hub%2C%20I%20am%20interested..."
                      },
                      "status": {
                        "type": "string",
                        "example": "NEW"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/categories": {
    "get": {
      "tags": [
        "5. Tier 4: Client User / Visitor (Zero Registration)"
      ],
      "summary": "List Product and Repair Categories",
      "parameters": [
        {
          "name": "type",
          "in": "query",
          "schema": {
            "type": "string",
            "enum": [
              "accessory",
              "repair"
            ]
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Categories list."
        }
      }
    }
  },
  "/shops/{shopId}": {
    "get": {
      "tags": [
        "5. Tier 4: Client User / Visitor (Zero Registration)"
      ],
      "summary": "Get Public Shop Details by ID",
      "parameters": [
        {
          "name": "shopId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Shop information with active offers."
        }
      }
    }
  },
  "/shops/{shopId}/products": {
    "get": {
      "tags": [
        "5. Tier 4: Client User / Visitor (Zero Registration)"
      ],
      "summary": "Get Products for Specific Shop",
      "parameters": [
        {
          "name": "shopId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
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
        },
        {
          "name": "search",
          "in": "query",
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Shop products list."
        }
      }
    }
  },
  "/products/featured": {
    "get": {
      "tags": [
        "5. Tier 4: Client User / Visitor (Zero Registration)"
      ],
      "summary": "Featured Products from Verified Stores",
      "responses": {
        "200": {
          "description": "Featured products list."
        }
      }
    }
  },
  "/public/landing-page": {
    "get": {
      "tags": [
        "5. Tier 4: Client User / Visitor (Zero Registration)"
      ],
      "summary": "Get Dynamic Landing Page Hero, Stats & Sections",
      "responses": {
        "200": {
          "description": "Landing page dynamic content."
        }
      }
    }
  },
  "/enquiries/whatsapp": {
    "post": {
      "tags": [
        "5. Tier 4: Client User / Visitor (Zero Registration)"
      ],
      "summary": "Direct WhatsApp Click-to-Chat Lead Generation",
      "description": "Generates an immediate pre-filled WhatsApp click-to-chat URL with the shop owner phone number and customer message.",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "shopId",
                "customerName",
                "customerPhone",
                "message"
              ],
              "properties": {
                "shopId": {
                  "type": "string",
                  "example": "shop-uuid-001"
                },
                "productId": {
                  "type": "string",
                  "example": "prod-101"
                },
                "customerName": {
                  "type": "string",
                  "example": "Rahul Sharma"
                },
                "customerPhone": {
                  "type": "string",
                  "example": "+91 99887 76655"
                },
                "message": {
                  "type": "string",
                  "example": "Hi! Is the iPhone 15 Matte Shield Case in stock?"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "WhatsApp click-to-chat URL generated.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "data": {
                    "type": "object",
                    "properties": {
                      "whatsappUrl": {
                        "type": "string",
                        "example": "https://wa.me/919845012345?text=Hello%20Pooja%20Mobile%20Hub..."
                      },
                      "enquiryId": {
                        "type": "string",
                        "example": "enq-uuid-777"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Validation failed."
        },
        "404": {
          "description": "Shop or product not found."
        }
      }
    }
  }
};
