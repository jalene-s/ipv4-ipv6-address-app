import requests

# get the computer's current public IP information
url = "https://ipapi.co/json/"

try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    data = response.json()

    # get information from the API response
    ip = data.get("ip")
    version = data.get("version")
    city = data.get("city")
    region = data.get("region")
    country = data.get("country_name")
    country_code = data.get("country_code")
    timezone = data.get("timezone")
    asn = data.get("asn")
    organization = data.get("org")

    # display the IP addressing information
    print()
    print("========================================")
    print("      IPv4/IPv6 Address Application")
    print("========================================")
    print(f"IP Address:   {ip}")
    print(f"IP Version:   {version}")
    print(f"City:         {city}")
    print(f"Region:       {region}")
    print(f"Country:      {country} ({country_code})")
    print(f"Timezone:     {timezone}")
    print(f"ASN:          {asn}")
    print(f"Provider:     {organization}")
    print("========================================")
    print()

except requests.exceptions.RequestException as error:
    print("Unable to retrieve IP information.")
    print(f"Error: {error}")