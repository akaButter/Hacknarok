#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/i2c.h>

#include "oled.h"
#include "model.h"
#include "led.h"

#define I2C_NODE DT_NODELABEL(i2c1)

static const struct device *i2c_dev;

static float features[5];

int main(void)
{
    i2c_dev = DEVICE_DT_GET(I2C_NODE);

    if (oled_init(i2c_dev) != 0)
        return 0;
    led_bar_init();

    oled_clear();

    oled_write_line(0, "  Autobus 101");
    oled_write_line(1, "  Temp: 21 C");
    oled_write_line(2, "  Hum: 45 %");
    oled_write_line(3, "  People: 12");

    int result;

    features[0] = 35.0f;    // temperature (high)
    features[1] = 90.0f;    // humidity (very high)
    features[2] = 0.9f;     // density (high)
    features[3] = 900.0f;   // light (very bright)
    features[4] = 1030.0f;  // pressure (high)
    result = predict(features);

    led_bar_set(result);
}