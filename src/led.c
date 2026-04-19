#include "led.h"
#include <zephyr/drivers/gpio.h>
#include <zephyr/logging/log.h>

LOG_MODULE_REGISTER(led_bar, LOG_LEVEL_INF);

#define GPIO1_NODE DT_NODELABEL(gpio1)
static const struct device *gpio1 = DEVICE_DT_GET(GPIO1_NODE);

/* P1.08–P1.15 */
static const uint8_t pins[8] = {8, 9, 10, 11, 12, 13, 14, 15};

/* Common anode → active LOW */
void led_bar_set(uint8_t value)
{
    if (value > 8) value = 8;

    for (int i = 0; i < 8; i++) {
        gpio_pin_set(gpio1, pins[i], (i < value) ? 0 : 1);
    }
}

int led_bar_init(void)
{
    if (!device_is_ready(gpio1)) {
        LOG_ERR("GPIO1 not ready!");
        return -1;
    }

    for (int i = 0; i < 8; i++) {
        gpio_pin_configure(gpio1, pins[i], GPIO_OUTPUT);
        gpio_pin_set(gpio1, pins[i], 1); // OFF
    }

    LOG_INF("LED bar initialized (P1.08–P1.15)");
    return 0;
}