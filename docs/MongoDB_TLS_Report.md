# MongoDB Atlas TLS Diagnostic Report

## Executive Summary
This report diagnoses the `TLSV1_ALERT_INTERNAL_ERROR` encountered when attempting to connect the FoodBridge backend to MongoDB Atlas.

Through systematic network, DNS, and multi-runtime diagnostics, we have successfully isolated the root cause: **the client's public IP address is blocked by the MongoDB Atlas IP Access List (Firewall)**.

Contrary to initial assumptions, this is **not** a Python 3.14 compatibility issue.

---

## Diagnostic Steps & Evidence

### 1. Multi-Runtime Isolation Test
We executed the diagnostic connection script using the `uv` virtual environment manager across multiple CPython runtimes. The error reproduces identically regardless of Python or OpenSSL version:

- **Python 3.14.3** (OpenSSL 3.0.18):
  `[SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error (_ssl.c:1081)`
- **Python 3.12.13** (OpenSSL 3.5.5):
  `[SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error (_ssl.c:1010)`

This proves the connection failure is independent of the Python interpreter or OpenSSL library version.

### 2. Network & DNS Verification
Our network diagnostic script ([network_test.py](file:///c:/Users/Deep%20Saha/Desktop/FoodBridge/apps/api/diagnostics/network_test.py)) confirmed:
- DNS SRV records for `cluster0.djsgzsg.mongodb.net` resolve correctly to three replica shards.
- Public IP lookup is functional. Current client public IP: **`49.37.2.150`**.
- TCP Port **`27017`** is open and reachable on all three shard endpoints.

### 3. OpenSSL Handshake Analysis
Our raw SSL handshake test ([raw_ssl_test.py](file:///c:/Users/Deep%20Saha/Desktop/FoodBridge/apps/api/diagnostics/raw_ssl_test.py)) showed that the server returned a **TLS Alert 80 (Internal Error)** during the client handshake before any application protocol occurred.
In MongoDB Atlas, the front-facing Load Balancer / SNI Router closes the connection with a TLS Alert when the connecting client's IP is not whitelisted.

---

## Action Plan for Developers

To resolve this issue, the MongoDB Atlas administrator must configure the cluster's Network Access rules:

1. **Log in** to the MongoDB Atlas Console.
2. Navigate to **Security** -> **Network Access** in the left sidebar.
3. Click **Add IP Address**.
4. Perform one of the following:
   - **For Development (Recommended)**: Click **Allow Access From Anywhere** (adds `0.0.0.0/0`).
   - **For Strict Security**: Add the specific client IP: **`49.37.2.150`**.
5. Click **Confirm** and wait 1–2 minutes for the status to change to *Active*.
6. Run the seed script:
   ```powershell
   python -m app.database.seed
   ```
