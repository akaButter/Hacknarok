#ifndef LED_BAR_H
#define LED_BAR_H

#include <zephyr/device.h>
#include <stdint.h>

int led_bar_init(void);
void led_bar_set(uint8_t value);

#endif