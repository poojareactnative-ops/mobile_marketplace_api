export const systemSwagger = {
  "/analytics/track-visitor": {
    "post": {
      "tags": [
        "7. System & Analytics"
      ],
      "summary": "Track Visitor Engagement & Interactions",
      "description": "Anonymous visitor tracking for page views, nearby distance searches, and click-to-chat lead clicks.",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/VisitorTrackingPayload"
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Visitor action tracked successfully.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "message": {
                    "type": "string",
                    "example": "Visitor action tracked"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/system/analytics/visitors": {
    "get": {
      "tags": [
        "7. System & Analytics"
      ],
      "summary": "Platform-wide Visitor & Traffic Analytics",
      "description": "System administrator overview of visitor counts, bounce rate, nearby search conversions, and lead CTR.",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "period",
          "in": "query",
          "schema": {
            "type": "string",
            "enum": [
              "24h",
              "7d",
              "30d",
              "90d",
              "all"
            ],
            "default": "30d"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Aggregated analytics data.",
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
                      "period": {
                        "type": "string",
                        "example": "30d"
                      },
                      "totalPageViews": {
                        "type": "integer",
                        "example": 14250
                      },
                      "nearbySearches": {
                        "type": "integer",
                        "example": 3820
                      },
                      "whatsappClicks": {
                        "type": "integer",
                        "example": 1140
                      },
                      "breakdownByDate": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "date": {
                              "type": "string",
                              "example": "2026-10-01"
                            },
                            "count": {
                              "type": "integer",
                              "example": 420
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
        }
      }
    }
  },
  "/system/seller-applications": {
    "get": {
      "tags": [
        "7. System & Analytics"
      ],
      "summary": "List All Seller Applications (System Admin)",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "status",
          "in": "query",
          "schema": {
            "type": "string",
            "enum": [
              "PENDING",
              "APPROVED",
              "REJECTED"
            ]
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
        }
      ],
      "responses": {
        "200": {
          "description": "List of seller onboarding applications."
        }
      }
    }
  },
  "/system/seller-applications/{id}": {
    "get": {
      "tags": [
        "7. System & Analytics"
      ],
      "summary": "Get Seller Application Details by ID (System Admin)",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Seller application details."
        },
        "404": {
          "description": "Application not found."
        }
      }
    }
  },
  "/system/seller-applications/{id}/approve": {
    "patch": {
      "tags": [
        "7. System & Analytics"
      ],
      "summary": "Approve Seller Application & Activate Shop (System Admin)",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Application approved and shop activated.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "message": {
                    "type": "string",
                    "example": "Seller application approved successfully"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/system/seller-applications/{id}/reject": {
    "patch": {
      "tags": [
        "7. System & Analytics"
      ],
      "summary": "Reject Seller Application (System Admin)",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "rejectionReason"
              ],
              "properties": {
                "rejectionReason": {
                  "type": "string",
                  "example": "Provided trade license document is expired."
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Application rejected."
        }
      }
    }
  },
  "/system/shops": {
    "get": {
      "tags": [
        "7. System & Analytics"
      ],
      "summary": "List All Registered Shops Across Platform (System Admin)",
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
          }
        },
        {
          "name": "isActive",
          "in": "query",
          "schema": {
            "type": "boolean"
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
        }
      ],
      "responses": {
        "200": {
          "description": "List of all shops."
        }
      }
    }
  },
  "/system/shops/{id}": {
    "patch": {
      "tags": [
        "7. System & Analytics"
      ],
      "summary": "Update Shop Verification / Active Status (System Admin)",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "isActive": {
                  "type": "boolean",
                  "example": true
                },
                "isVerified": {
                  "type": "boolean",
                  "example": true
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Shop status updated successfully."
        }
      }
    }
  },
  "/system/landing-page": {
    "get": {
      "tags": [
        "7. System & Analytics"
      ],
      "summary": "Get All Landing Page Sections (Including Drafts)",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "responses": {
        "200": {
          "description": "All landing page sections."
        }
      }
    },
    "patch": {
      "tags": [
        "7. System & Analytics"
      ],
      "summary": "Create or Update Landing Page Section",
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
                "key",
                "title"
              ],
              "properties": {
                "key": {
                  "type": "string",
                  "example": "hero_banner"
                },
                "title": {
                  "type": "string",
                  "example": "Bangalore’s Fastest Mobile Repair & Accessory Hub"
                },
                "subtitle": {
                  "type": "string",
                  "example": "Find verified local mobile experts within 2 km of your location."
                },
                "body": {
                  "type": "string",
                  "example": "Genuine accessories with warranties and transparent walk-in repairs."
                },
                "imageUrl": {
                  "type": "string",
                  "example": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
                },
                "ctaLabel": {
                  "type": "string",
                  "example": "Explore Nearby Stores"
                },
                "ctaUrl": {
                  "type": "string",
                  "example": "/shops/nearby"
                },
                "isPublished": {
                  "type": "boolean",
                  "example": true
                },
                "sortOrder": {
                  "type": "integer",
                  "example": 1
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Landing page section updated."
        }
      }
    }
  }
};
