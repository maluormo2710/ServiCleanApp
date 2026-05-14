import requests
import json

BASE_URL = "http://localhost:8000/api"

print("--- Testing API ---")

# 1. Login Admin
print("\n[+] Testing Login as Admin")
res = requests.post(f"{BASE_URL}/auth/login", json={"email": "admin@serviclean.com", "password": "Admin1234!"})
if res.status_code == 200:
    token = res.json().get("access_token")
    print("  -> Success! Token received.")
    
    # 2. Test Get Profile
    print("\n[+] Testing GET /auth/me")
    headers = {"Authorization": f"Bearer {token}"}
    me_res = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"  -> {me_res.status_code}: {me_res.text}")

    # 3. Test Admin Users
    print("\n[+] Testing GET /admin/usuarios")
    admin_users_res = requests.get(f"{BASE_URL}/admin/usuarios", headers=headers)
    if admin_users_res.status_code == 200:
         print(f"  -> Success! Fetched {len(admin_users_res.json())} users.")
    else:
         print(f"  -> {admin_users_res.status_code}: {admin_users_res.text}")
else:
    print(f"  -> Failed: {res.status_code} {res.text}")

# 4. Test missing user
print("\n[+] Testing Login as invalid user")
res2 = requests.post(f"{BASE_URL}/auth/login", json={"email": "notexists@serviclean.com", "password": "wrong"})
print(f"  -> {res2.status_code}: {res2.text}")

# 5. List Colaboradores (public)
print("\n[+] Testing GET /colaboradores")
colab_res = requests.get(f"{BASE_URL}/colaboradores")
if colab_res.status_code == 200:
     print(f"  -> Success! Fetched {len(colab_res.json())} colaboradores.")
else:
     print(f"  -> {colab_res.status_code}: {colab_res.text}")

