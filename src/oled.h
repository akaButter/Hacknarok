#ifndef oled_DISPLAY_H
#define oled_DISPLAY_H

#include <zephyr/device.h>
#include <zephyr/drivers/i2c.h>
#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

/* Initialize display driver (must be called once) */
int oled_init(const struct device *i2c_dev);

/* Clear full screen */
void oled_clear(void);

/* Write single line (page = 0–7) */
void oled_write_line(uint8_t page, const char *text);

/* Write on first page only */
void oled_write(const char *text);

#ifdef __cplusplus
}
#endif

#endif /* oled_DISPLAY_H */