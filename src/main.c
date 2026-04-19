#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/i2c.h>
#include <zephyr/logging/log.h>
#include <stdio.h>

#include "oled.h"
#include "model.h"
#include "led.h"
#include "people_counter.h"

LOG_MODULE_REGISTER(main_app, LOG_LEVEL_INF);

#define I2C_NODE DT_NODELABEL(i2c1)

static const struct device *i2c_dev;

static float features[5];

int main(void)
{
    LOG_INF("System boot");

    i2c_dev = DEVICE_DT_GET(I2C_NODE);

    if (!device_is_ready(i2c_dev)) {
        LOG_ERR("I2C not ready");
        return 0;
    }

    if (oled_init(i2c_dev) != 0) {
        LOG_ERR("OLED init failed");
        return 0;
    } 

    oled_clear();
    oled_write_line(0, "  Autobus B01");
    oled_write_line(1, "  Tempereture: 21");
    oled_write_line(2, "  Humidity: 45");

    led_bar_init();

    if (people_counter_init() != 0) {
        LOG_ERR("  People counter init failed");
        return 0;
    }

    people_counter_start();
    LOG_INF("  People counter started");

    features[0] = 35.0f;
    features[1] = 90.0f;
    features[2] = 0.9f;
    features[3] = 900.0f;
    features[4] = 1030.0f;

    int result = predict(features);
    led_bar_set(result);

    static int last_people = -1;

    while (1) {
        char buf[32];

        int current = people_counter_get();

        if (current != last_people) {
            snprintf(buf, sizeof(buf), "  People: %d", current);
            oled_write_line(3, buf);

            LOG_INF("People changed: %d", current);

            last_people = current;
        }

        k_msleep(1000);
    }
}