#ifndef oled_DISPLAY_H
#define oled_DISPLAY_H

#include <zephyr/device.h>
#include <zephyr/drivers/i2c.h>
#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

int oled_init(const struct device *i2c_dev);

void oled_clear(void);

void oled_write_line(uint8_t page, const char *text);

void oled_write(const char *text);

#ifdef __cplusplus
}
#endif

#endif 