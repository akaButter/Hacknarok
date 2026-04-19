#include "people_counter.h"

#include <zephyr/kernel.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/logging/log.h>

LOG_MODULE_REGISTER(people_counter, LOG_LEVEL_DBG);

/* ====== CONFIG ====== */
#define WALL_DISTANCE_CM 150.0
#define TRIGGER_MARGIN   40.0
#define COOLDOWN_MS      800
#define SAMPLE_PERIOD_MS 500

/* ====== GPIO ====== */
static const struct gpio_dt_spec trig =
    GPIO_DT_SPEC_GET(DT_NODELABEL(trig_pin), gpios);

static const struct gpio_dt_spec echo =
    GPIO_DT_SPEC_GET(DT_NODELABEL(echo_pin), gpios);

/* ====== STATE ====== */
static int people_count = 0;
static bool object_present = false;

/* ====== INTERNAL ====== */
static double measure_once(void)
{
    uint32_t start_time, stop_time, cycles_spent;
    uint32_t timeout_cnt;

    gpio_pin_set_dt(&trig, 1);
    k_busy_wait(10);
    gpio_pin_set_dt(&trig, 0);

    LOG_DBG("Trigger sent");

    unsigned int key = irq_lock();

    timeout_cnt = 0;
    while (gpio_pin_get_dt(&echo) == 0) {
        if (++timeout_cnt > 100000) {
            irq_unlock(key);
            LOG_WRN("Echo HIGH timeout (no signal)");
            return -1.0;
        }
    }

    start_time = k_cycle_get_32();
    LOG_DBG("Echo went HIGH");

    timeout_cnt = 0;
    while (gpio_pin_get_dt(&echo) == 1) {
        if (++timeout_cnt > 100000) {
            irq_unlock(key);
            LOG_WRN("Echo LOW timeout (stuck HIGH)");
            return -1.0;
        }
    }

    stop_time = k_cycle_get_32();
    irq_unlock(key);

    cycles_spent = stop_time - start_time;
    uint32_t duration_us = k_cyc_to_us_near32(cycles_spent);

    double dist = (duration_us * 0.0343) / 2.0;

    LOG_DBG("Duration: %u us -> Dist: %.2f cm", duration_us, dist);

    return dist;
}

/* ====== THREAD ====== */
static void people_thread(void)
{
    LOG_INF("People counter thread started");

    while (1) {

        double sum = 0;
        int valid = 0;

        for (int i = 0; i < 3; i++) {
            double d = measure_once();

            LOG_DBG("Sample %d = %.2f cm", i, d);

            if (d > 2.0 && d < 400.0) {
                sum += d;
                valid++;
            } else {
                LOG_WRN("Invalid sample: %.2f", d);
            }

            k_busy_wait(500);
        }

        if (valid > 0) {
            double current_dist = sum / valid;

            LOG_INF("Avg distance: %.2f cm", current_dist);

            if (current_dist < (WALL_DISTANCE_CM - TRIGGER_MARGIN)) {

                if (!object_present) {
                    people_count++;
                    object_present = true;

                    LOG_INF("PERSON DETECTED -> total = %d", people_count);

                    k_msleep(COOLDOWN_MS);
                } else {
                    LOG_DBG("Object still present (not counting)");
                }

            } else {
                object_present = false;
                LOG_DBG("No object detected");
            }

        } else {
            LOG_WRN("No valid samples in cycle");
        }

        k_msleep(SAMPLE_PERIOD_MS);
    }
}

/* ====== API ====== */

int people_counter_init(void)
{
    if (!gpio_is_ready_dt(&trig) || !gpio_is_ready_dt(&echo)) {
        LOG_ERR("GPIO not ready");
        return -1;
    }

    gpio_pin_configure_dt(&trig, GPIO_OUTPUT_INACTIVE);
    gpio_pin_configure_dt(&echo, GPIO_INPUT);

    LOG_INF("People counter init OK");

    return 0;
}

void people_counter_start(void)
{
    static K_THREAD_STACK_DEFINE(stack, 2048);
    static struct k_thread thread_data;

    LOG_INF("Starting people counter thread");

    k_thread_create(&thread_data, stack, K_THREAD_STACK_SIZEOF(stack),
                    (k_thread_entry_t)people_thread,
                    NULL, NULL, NULL,
                    5, 0, K_NO_WAIT);
}

int people_counter_get(void)
{
    return people_count;
}

void people_counter_reset(void)
{
    people_count = 0;
    LOG_INF("Counter reset");
}