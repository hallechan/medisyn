import serial
import time

PORT = "COM10"   # change to your port: e.g., "COM4", "/dev/ttyACM0", "/dev/tty.usbmodem1101"
BAUD = 9600

def get_temperature():
    """Reads one temperature value from Arduino and returns it as a float."""
    with serial.Serial(PORT, BAUD, timeout=2) as ser:
        time.sleep(2)  # wait for Arduino to reset after opening port
        ser.reset_input_buffer()

        line = ser.readline()
        if not line:
            raise TimeoutError("No data received from Arduino (timeout).")

        try:
            value = float(line.decode().strip())
            return value
        except ValueError:
            raise ValueError(f"Could not parse temperature from line: {line!r}")