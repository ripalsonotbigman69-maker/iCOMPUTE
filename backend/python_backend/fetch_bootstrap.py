import urllib.request
try:
    r = urllib.request.urlopen("http://127.0.0.1:8000/api/bootstrap?email=icompute%40gmail.com")
    print(r.read().decode())
except Exception as e:
    try:
        print(e.read().decode())
    except Exception:
        print(str(e))
