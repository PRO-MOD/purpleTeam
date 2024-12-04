from pyModbusTCP.client import ModbusClient

# Modbus server configuration
SERVER_HOST = "localhost"
SERVER_PORT = 5020
REGISTER_ADDRESS = 0  # Address of the register to read/write

def read_register(client):
    """Read the current value of a Modbus register."""
    value = client.read_holding_registers(REGISTER_ADDRESS, 1)
    if value:
        return value[0]  # Return the first value in the list
    else:
        print("Failed to read register.")
        return None

def write_register(client, value):
    """Write a value to a Modbus register."""
    if client.write_single_register(REGISTER_ADDRESS, value):
        print(f"Successfully wrote value {value} to register.")
    else:
        print("Failed to write to register.")

def main():
    # Create a Modbus client instance
    client = ModbusClient(host=SERVER_HOST, port=SERVER_PORT)

    try:
        # Connect to the Modbus server
        if not client.open():
            print("Unable to connect to Modbus server.")
            return

        print("Connected to Modbus server.")

        # Step 1: Read the current register value and print to console
        current_value = read_register(client)
        if current_value is not None:
            print(f"Current register value: {current_value}")

        # Step 2: Update the register value to something above 100 if necessary
        if current_value is None or current_value <= 100:
            new_value = 101  # Set a value above 100
            write_register(client, new_value)

            # Step 3: Read the updated value and print to console
            updated_value = read_register(client)
            if updated_value is not None:
                print(f"Updated register value: {updated_value}")
        else:
            print("No update needed. Register value is already above 100.")

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        # Close the Modbus client connection
        client.close()
        print("Disconnected from Modbus server.")

if __name__ == "__main__":
    main()
