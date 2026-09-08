import tkinter as tk
from tkinter import messagebox
import requests


def get_ip_information():
    try:
        # Get the computer's current public IP address
        ip_url = "https://api64.ipify.org?format=json"
        ip_response = requests.get(ip_url, timeout=10)
        ip_response.raise_for_status()

        ip = ip_response.json().get("ip")

        if not ip:
            raise ValueError("Public IP address was not found.")

        # Get information about the public IP address
        info_url = f"https://ipinfo.io/{ip}/json"
        info_response = requests.get(info_url, timeout=10)
        info_response.raise_for_status()

        data = info_response.json()

        # Get information from the API response
        city = data.get("city", "N/A")
        region = data.get("region", "N/A")
        country = data.get("country", "N/A")
        timezone = data.get("timezone", "N/A")
        organization = data.get("org", "N/A")

        # Determine the IP version
        if ":" in ip:
            version = "IPv6"
        else:
            version = "IPv4"

        # Display the information in the GUI
        ip_value.config(text=ip)
        version_value.config(text=version)
        city_value.config(text=city)
        region_value.config(text=region)
        country_value.config(text=country)
        timezone_value.config(text=timezone)
        provider_value.config(text=organization)

    except requests.exceptions.RequestException as error:
        messagebox.showerror(
            "Connection Error",
            f"Unable to retrieve IP information.\n\n{error}"
        )

    except ValueError as error:
        messagebox.showerror("Error", str(error))


# Create the main window
window = tk.Tk()
window.title("IPv4/IPv6 Address Application")
window.geometry("600x500")
window.resizable(False, False)

# Title
title = tk.Label(
    window,
    text="IPv4/IPv6 Address Application",
    font=("Arial", 20, "bold")
)
title.pack(pady=20)

subtitle = tk.Label(
    window,
    text="Public IP Address Information",
    font=("Arial", 11)
)
subtitle.pack(pady=5)


# Information frame
info_frame = tk.Frame(window)
info_frame.pack(pady=20)


# Labels and values
tk.Label(
    info_frame,
    text="IP Address:",
    font=("Arial", 11, "bold")
).grid(row=0, column=0, sticky="w", padx=10, pady=8)

ip_value = tk.Label(
    info_frame,
    text="Not loaded",
    font=("Arial", 11)
)
ip_value.grid(row=0, column=1, sticky="w", padx=10, pady=8)


tk.Label(
    info_frame,
    text="IP Version:",
    font=("Arial", 11, "bold")
).grid(row=1, column=0, sticky="w", padx=10, pady=8)

version_value = tk.Label(
    info_frame,
    text="Not loaded",
    font=("Arial", 11)
)
version_value.grid(row=1, column=1, sticky="w", padx=10, pady=8)


tk.Label(
    info_frame,
    text="City:",
    font=("Arial", 11, "bold")
).grid(row=2, column=0, sticky="w", padx=10, pady=8)

city_value = tk.Label(
    info_frame,
    text="Not loaded",
    font=("Arial", 11)
)
city_value.grid(row=2, column=1, sticky="w", padx=10, pady=8)


tk.Label(
    info_frame,
    text="Region:",
    font=("Arial", 11, "bold")
).grid(row=3, column=0, sticky="w", padx=10, pady=8)

region_value = tk.Label(
    info_frame,
    text="Not loaded",
    font=("Arial", 11)
)
region_value.grid(row=3, column=1, sticky="w", padx=10, pady=8)


tk.Label(
    info_frame,
    text="Country:",
    font=("Arial", 11, "bold")
).grid(row=4, column=0, sticky="w", padx=10, pady=8)

country_value = tk.Label(
    info_frame,
    text="Not loaded",
    font=("Arial", 11)
)
country_value.grid(row=4, column=1, sticky="w", padx=10, pady=8)


tk.Label(
    info_frame,
    text="Timezone:",
    font=("Arial", 11, "bold")
).grid(row=5, column=0, sticky="w", padx=10, pady=8)

timezone_value = tk.Label(
    info_frame,
    text="Not loaded",
    font=("Arial", 11)
)
timezone_value.grid(row=5, column=1, sticky="w", padx=10, pady=8)


tk.Label(
    info_frame,
    text="Provider:",
    font=("Arial", 11, "bold")
).grid(row=6, column=0, sticky="w", padx=10, pady=8)

provider_value = tk.Label(
    info_frame,
    text="Not loaded",
    font=("Arial", 11)
)
provider_value.grid(row=6, column=1, sticky="w", padx=10, pady=8)


# Get information button
get_button = tk.Button(
    window,
    text="Get IP Information",
    command=get_ip_information,
    font=("Arial", 12, "bold"),
    padx=20,
    pady=10
)
get_button.pack(pady=20)


# Footer
footer = tk.Label(
    window,
    text="Uses public IP APIs to retrieve network information",
    font=("Arial", 9)
)
footer.pack(pady=5)


# Start the application
window.mainloop()