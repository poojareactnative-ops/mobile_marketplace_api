export const repairSwagger = {
  "/seller/admin/repair-jobs": {
    "post": {
      "tags": [
        "4. Tier 3: Seller Admin (Store Staff)"
      ],
      "summary": "Submit Local Repair Job for Customer Ticket",
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
                "customerName",
                "customerPhone",
                "problemDescription"
              ],
              "properties": {
                "customerName": {
                  "type": "string",
                  "example": "Vijay Sundaram"
                },
                "customerPhone": {
                  "type": "string",
                  "example": "9812345678"
                },
                "brand": {
                  "type": "string",
                  "example": "Apple iPhone"
                },
                "model": {
                  "type": "string",
                  "example": "iPhone 14 Pro"
                },
                "problemDescription": {
                  "type": "string",
                  "example": "Screen glass broken, digitizer functioning normally."
                },
                "estimatedCostPaise": {
                  "type": "integer",
                  "description": "Price in paise (₹5,999.00 = 599900)",
                  "example": 599900
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Repair ticket created.",
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
                      "ticketId": {
                        "type": "string",
                        "example": "rep-uuid-9999"
                      },
                      "referenceNumber": {
                        "type": "string",
                        "example": "REP-9999"
                      },
                      "status": {
                        "type": "string",
                        "example": "UNDER_REVIEW"
                      },
                      "estimatedCostPaise": {
                        "type": "integer",
                        "example": 599900
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
    "get": {
      "tags": [
        "4. Tier 3: Seller Admin (Store Staff)"
      ],
      "summary": "List Store Repair Tickets",
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
            "type": "string"
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
          "description": "Paginated list of repair tickets."
        }
      }
    }
  },
  "/seller/admin/repair-jobs/{jobId}": {
    "get": {
      "tags": [
        "4. Tier 3: Seller Admin (Store Staff)"
      ],
      "summary": "Get Repair Ticket Details & Audit History",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "jobId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Repair job details with full updates trail."
        }
      }
    },
    "patch": {
      "tags": [
        "4. Tier 3: Seller Admin (Store Staff)"
      ],
      "summary": "Update Repair Diagnostic Status & Quote",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "jobId",
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
                "status": {
                  "type": "string",
                  "enum": [
                    "SUBMITTED",
                    "UNDER_REVIEW",
                    "QUOTED",
                    "APPROVED",
                    "IN_PROGRESS",
                    "READY",
                    "COMPLETED",
                    "CANCELLED",
                    "NOT_REPAIRABLE"
                  ],
                  "example": "IN_PROGRESS"
                },
                "estimatedCostPaise": {
                  "type": "integer",
                  "example": 599900
                },
                "note": {
                  "type": "string",
                  "example": "Original display panel arrived and being assembled."
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Repair ticket status and diagnostic notes updated."
        }
      }
    }
  },
  "/seller/admin/repair-jobs/{jobId}/updates": {
    "post": {
      "tags": [
        "4. Tier 3: Seller Admin (Store Staff)"
      ],
      "summary": "Append Diagnostic Audit Note to Ticket",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "jobId",
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
                "status",
                "note"
              ],
              "properties": {
                "status": {
                  "type": "string",
                  "example": "IN_PROGRESS"
                },
                "note": {
                  "type": "string",
                  "example": "Hardware diagnostics complete. Assembly in progress."
                },
                "estimatedCostPaise": {
                  "type": "integer",
                  "example": 599900
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Update logged."
        }
      }
    }
  },
  "/public/repairs/book": {
    "post": {
      "tags": [
        "6. Repair Services & Online Tracking"
      ],
      "summary": "Guest Repair Booking (No Login Required)",
      "description": "Enables any client to book a repair ticket without account creation or login fatigue.",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "customerName",
                "customerPhone",
                "brand",
                "model",
                "problemDescription"
              ],
              "properties": {
                "customerName": {
                  "type": "string",
                  "example": "Suresh Raina"
                },
                "customerPhone": {
                  "type": "string",
                  "example": "9888877777"
                },
                "customerEmail": {
                  "type": "string",
                  "example": "suresh@example.com"
                },
                "brand": {
                  "type": "string",
                  "example": "Samsung"
                },
                "model": {
                  "type": "string",
                  "example": "Galaxy S23 Ultra"
                },
                "problemDescription": {
                  "type": "string",
                  "example": "Battery draining fast after software update."
                },
                "preferredShopId": {
                  "type": "string",
                  "example": "shop-uuid-001"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Repair ticket generated.",
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
                      "ticketId": {
                        "type": "string",
                        "example": "rep-uuid-8888"
                      },
                      "referenceNumber": {
                        "type": "string",
                        "example": "REP-8888"
                      },
                      "status": {
                        "type": "string",
                        "example": "SUBMITTED"
                      },
                      "brand": {
                        "type": "string",
                        "example": "Samsung"
                      },
                      "model": {
                        "type": "string",
                        "example": "Galaxy S23 Ultra"
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
  "/public/repairs/track": {
    "get": {
      "tags": [
        "6. Repair Services & Online Tracking"
      ],
      "summary": "Track Repair Status Online (Milestone Progress Bar)",
      "description": "Live milestone progress tracking without login. Tracks step: SUBMITTED ➔ UNDER_REVIEW ➔ QUOTED ➔ APPROVED ➔ IN_PROGRESS ➔ READY ➔ COMPLETED.",
      "parameters": [
        {
          "name": "ticketId",
          "in": "query",
          "schema": {
            "type": "string"
          },
          "example": "REP-8888",
          "description": "Ticket ID or Reference number"
        },
        {
          "name": "phone",
          "in": "query",
          "schema": {
            "type": "string"
          },
          "example": "9888877777",
          "description": "Customer phone number"
        }
      ],
      "responses": {
        "200": {
          "description": "Live milestone repair tracking status and cost estimate.",
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
                      "ticketId": {
                        "type": "string",
                        "example": "rep-uuid-8888"
                      },
                      "referenceNumber": {
                        "type": "string",
                        "example": "REP-8888"
                      },
                      "customerName": {
                        "type": "string",
                        "example": "Suresh Raina"
                      },
                      "status": {
                        "type": "string",
                        "example": "IN_PROGRESS"
                      },
                      "currentMilestoneIndex": {
                        "type": "integer",
                        "example": 4
                      },
                      "milestones": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "step": {
                              "type": "integer",
                              "example": 1
                            },
                            "status": {
                              "type": "string",
                              "example": "SUBMITTED"
                            },
                            "isCompleted": {
                              "type": "boolean",
                              "example": true
                            },
                            "isCurrent": {
                              "type": "boolean",
                              "example": false
                            }
                          }
                        }
                      },
                      "estimatedCostPaise": {
                        "type": "integer",
                        "example": 349900
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "404": {
          "description": "Ticket not found."
        }
      }
    }
  },
  "/seller/repair-customers": {
    "get": {
      "tags": [
        "6. Repair Services & Online Tracking"
      ],
      "summary": "List Shop Repair Customers (Alias)",
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
          "description": "Search by customer name or phone"
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
          "description": "List of repair customers."
        }
      }
    },
    "post": {
      "tags": [
        "6. Repair Services & Online Tracking"
      ],
      "summary": "Create Repair Customer (Alias)",
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
                  "example": "Regular customer for iPhone repairs"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Repair customer created."
        }
      }
    }
  },
  "/seller/repair-jobs": {
    "get": {
      "tags": [
        "6. Repair Services & Online Tracking"
      ],
      "summary": "List Repair Jobs for Shop (Alias)",
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
              "SUBMITTED",
              "UNDER_REVIEW",
              "QUOTED",
              "APPROVED",
              "IN_PROGRESS",
              "READY",
              "COMPLETED",
              "CANCELLED"
            ]
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
          "description": "List of repair jobs."
        }
      }
    },
    "post": {
      "tags": [
        "6. Repair Services & Online Tracking"
      ],
      "summary": "Create / Submit Repair Job (Alias)",
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
                "customerName",
                "customerPhone",
                "problemDescription"
              ],
              "properties": {
                "customerName": {
                  "type": "string",
                  "example": "Vijay Sundaram"
                },
                "customerPhone": {
                  "type": "string",
                  "example": "9812345678"
                },
                "customerEmail": {
                  "type": "string",
                  "example": "vijay@example.com"
                },
                "brand": {
                  "type": "string",
                  "example": "Apple"
                },
                "model": {
                  "type": "string",
                  "example": "iPhone 14 Pro"
                },
                "deviceId": {
                  "type": "string",
                  "example": "Apple iPhone 14 Pro"
                },
                "problemDescription": {
                  "type": "string",
                  "example": "Cracked front glass, camera glass intact."
                },
                "estimatedCostPaise": {
                  "type": "integer",
                  "example": 599900
                },
                "isSellable": {
                  "type": "boolean",
                  "example": false
                },
                "repairCustomerId": {
                  "type": "string",
                  "example": "cust-uuid-001"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Repair job created successfully."
        }
      }
    }
  },
  "/seller/repair-jobs/{jobId}": {
    "get": {
      "tags": [
        "6. Repair Services & Online Tracking"
      ],
      "summary": "Get Repair Job by ID (Alias)",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "jobId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Repair job details."
        }
      }
    },
    "patch": {
      "tags": [
        "6. Repair Services & Online Tracking"
      ],
      "summary": "Update Repair Job Status / Estimate (Alias)",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "jobId",
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
                "status": {
                  "type": "string",
                  "enum": [
                    "SUBMITTED",
                    "UNDER_REVIEW",
                    "QUOTED",
                    "APPROVED",
                    "IN_PROGRESS",
                    "READY",
                    "COMPLETED",
                    "CANCELLED"
                  ]
                },
                "estimatedCostPaise": {
                  "type": "integer",
                  "example": 649900
                },
                "finalCostPaise": {
                  "type": "integer",
                  "example": 649900
                },
                "note": {
                  "type": "string",
                  "example": "Customer approved revised quote"
                },
                "isSellable": {
                  "type": "boolean",
                  "example": false
                },
                "assignedToUserId": {
                  "type": "string",
                  "example": "user-uuid-staff-1"
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Repair job updated."
        }
      }
    }
  },
  "/seller/repair-jobs/{jobId}/updates": {
    "post": {
      "tags": [
        "6. Repair Services & Online Tracking"
      ],
      "summary": "Add Diagnostic Note / Status Update to Repair Job (Alias)",
      "security": [
        {
          "BearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "jobId",
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
                "status",
                "note"
              ],
              "properties": {
                "status": {
                  "type": "string",
                  "example": "IN_PROGRESS"
                },
                "note": {
                  "type": "string",
                  "example": "Original OLED replacement screen arrived and installation begun."
                },
                "estimatedCostPaise": {
                  "type": "integer",
                  "example": 599900
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Repair update added."
        }
      }
    }
  }
};
