# 🍔 Slawburger Inventory Management System

A full-featured **Flask-based restaurant inventory management application** integrated with the **Toast POS system**. Built for Slawburger to track ingredients, manage deliveries, handle stock adjustments, and automatically deduct inventory based on real-time sales orders.

---

## ✨ Features

### 📦 Inventory Management
- **Dashboard View** — All ingredients organized by category (Meat, Bread, Produce, Dairy, Sides, Sauce, Drink, Dessert)
- **CRUD Operations** — Add, edit, and delete ingredients with cost-per-unit tracking
- **Low Stock Alerts** — Configurable thresholds to flag items that need reordering

### 🚚 Goods Inward (Delivery Receiving)
- **Single Item Receiving** — Log individual deliveries with supplier and invoice details
- **Bulk Receiving** — Receive multiple items in a single operation
- **Delivery History** — Full audit trail of all received goods

### 📉 Stock Adjustments
- **Waste & Spoilage Logging** — Track lost inventory with reason codes
- **Manual Corrections** — Adjust stock levels with staff attribution
- **Adjustment History** — Complete log of all stock changes

### 🔗 Toast POS Integration
- **Order Sync** — Pull sales orders directly from Toast POS API
- **Preview Before Sync** — Dry-run mode to review deductions before applying
- **Confirm & Apply** — One-click sync to deduct ingredients based on actual sales
- **Menu Import** — Load Toast menu items into the local database

### 🍽️ Recipe Management
- **Menu-to-Ingredient Mapping** — Link Toast menu items to ingredient recipes
- **Auto Deduction** — When an order is synced, ingredients are automatically deducted based on recipes
- **Recipe CRUD** — Create, update, and delete recipes

### 📊 Order Tracking
- **Order History** — View recent orders with amounts and payment status
- **Order Details** — Drill into individual orders to see items and ingredient deductions
- **Sales Stats** — Total orders, revenue, and daily order counts

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3, Flask 3.0 |
| **Database** | SQLite |
| **Frontend** | HTML5, CSS3, JavaScript (Single-Page Dashboard) |
| **API Integration** | Toast POS REST API |
| **HTTP Client** | Requests 2.31 |

---

## 📂 Project Structure

```
inv_slawV202/
├── app.py                    # Main Flask application (15+ API endpoints)
├── requirements.txt          # Python dependencies
├── inventory.db              # SQLite database
├── toast_token.txt           # Toast API credentials
│
├── src/                      # Core backend modules
│   ├── __init__.py
│   ├── config.py             # Application configuration
│   ├── database.py           # Database connection & schema
│   ├── inventory_manager.py  # Ingredient & recipe CRUD
│   ├── goods_inward.py       # Delivery receiving logic
│   ├── inventory_adjustment.py # Waste & adjustment tracking
│   ├── toast_api.py          # Toast POS API integration
│   ├── Access_token.py       # Toast API authentication
│   └── logger.py             # Logging utility
│
├── templates/
│   └── index.html            # Full dashboard UI (single-page app)
│
├── static/
│   ├── css/style.css         # Application styles
│   ├── js/                   # Frontend scripts
│   └── assets/               # Images & static assets
│
├── data/                     # Data storage
├── logs/                     # Application logs
│
├── check_inventory.py        # Inventory inspection script
├── cleanup_db.py             # Database cleanup utility
├── debug_db.py               # Database debugging tool
└── inspect_row.py            # Row inspection utility
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bandaruu/inv_slawV2021.git
   cd inv_slawV2021/inv_slawV202
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   ```
   http://localhost:5000
   ```

---

## 🔌 API Endpoints

### Inventory
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stock` | Get all stock items |
| `POST` | `/api/ingredients` | Add new ingredient |
| `PUT` | `/api/ingredients/<id>` | Update ingredient |
| `DELETE` | `/api/ingredients/<id>` | Delete ingredient |

### Deliveries
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/receive` | Receive single delivery |
| `POST` | `/api/receive/bulk` | Receive bulk delivery |

### Adjustments
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/adjust` | Log stock adjustment |
| `GET` | `/api/history` | Get delivery & adjustment history |

### Toast POS Sync
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/sync/toast` | Preview sync (dry run) |
| `POST` | `/api/sync/toast/confirm` | Confirm & apply sync |
| `GET` | `/api/toast/menu` | Fetch Toast menu |
| `GET` | `/api/menu/local` | Get local menu items |

### Recipes
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recipes` | Get all recipes |
| `POST` | `/api/recipes` | Save/update recipe |
| `DELETE` | `/api/recipes/<guid>` | Delete recipe |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/orders` | Get recent orders |
| `GET` | `/api/orders/<id>` | Get order details |
| `GET` | `/api/orders/stats` | Get order statistics |

---

## ⚙️ Toast POS Setup

1. Obtain Toast API credentials (Client ID, Client Secret, Restaurant GUID)
2. Run the access token script to authenticate:
   ```bash
   python src/Access_token.py
   ```
3. Credentials are stored in `toast_token.txt`
4. Use the **Sync** button on the dashboard to pull orders

---

## 📄 License

This project is proprietary software developed for Slawburger restaurant operations.

---

## 👤 Author

**Bandaruu** — [GitHub](https://github.com/bandaruu)
