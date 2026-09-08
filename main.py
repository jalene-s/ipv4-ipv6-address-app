import requests

url = "https://ipapi.co/json/"

response = requests.get(url)
data = response.json()

ip = data.get("ip")
version = data.get("version")
city = data.get("city")
region = data.get("region")
country = data.get("country_name")
country_code = data.get("country_code")
timezone = data.get("timezone")
asn = data.get("asn")
organization = data.get("org")

print("========================================")
print("      IPv4/IPv6 Address Application")
print("========================================")
print(f"IP Address: {ip}")
print(f"IP Version: {version}")
print(f"City: {city}")
print(f"Region: {region}")
print(f"Country: {country} ({country_code})")
print(f"Timezone: {timezone}")
print(f"ASN: {asn}")
print(f"Organization: {organization}")
print("========================================")