#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/i2c.h>

#include "oled.h"
#include "model.h"

#define I2C_NODE DT_NODELABEL(i2c1)

static const struct device *i2c_dev;

static float features[5];

int main(void)
{
    i2c_dev = DEVICE_DT_GET(I2C_NODE);

    if (oled_init(i2c_dev) != 0)
        return 0;

    oled_clear();

    oled_write_line(0, "  Autobus 101");
    oled_write_line(1, "  Temp: 21 C");
    oled_write_line(2, "  Hum: 45 %");
    oled_write_line(3, "  People: 12");

    int result;

    features[0] = 21.0f;  // temperature
    features[1] = 45.0f;  // humidity
    features[2] = 0.5f;   // density
    features[3] = 100.0f; // light
    features[4] = 1013.0f;// pressure
    result = predict(features);

    char buf[32];
    snprintk(buf, sizeof(buf), "Result: %d", result);
    oled_write_line(4, buf);
}