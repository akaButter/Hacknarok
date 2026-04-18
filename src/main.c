#include <zephyr/kernel.h>
#include <zephyr/net/wifi_mgmt.h>
#include <zephyr/net/net_event.h>
#include <zephyr/logging/log.h>
#include <zephyr/device.h>
#include <zephyr/drivers/gpio.h>

LOG_MODULE_REGISTER(app, LOG_LEVEL_INF);

#define LED_NODE DT_ALIAS(led0)

static const struct gpio_dt_spec led = GPIO_DT_SPEC_GET(LED_NODE, gpios);

#define WIFI_SSID "Natalia"
#define WIFI_PSK  "iot_test_97595"

static struct net_mgmt_event_callback wifi_cb;

static bool connected = false;

static void handler(struct net_mgmt_event_callback *cb,
                    uint32_t mgmt_event,
                    struct net_if *iface)
{
    if (mgmt_event == NET_EVENT_IPV4_ADDR_ADD) {
        LOG_INF("WiFi connected + got IP");
        connected = true;
    }
}

int main(void)
{
    int ret;

    /* LED init */
    if (!gpio_is_ready_dt(&led)) {
        return 0;
    }

    gpio_pin_configure_dt(&led, GPIO_OUTPUT_INACTIVE);

    /* Register network callback */
    net_mgmt_init_event_callback(&wifi_cb, handler,
                                 NET_EVENT_IPV4_ADDR_ADD);
    net_mgmt_add_event_callback(&wifi_cb);

    struct net_if *iface = net_if_get_default();

    struct wifi_connect_req_params params = {0};

    params.ssid = WIFI_SSID;
    params.ssid_length = strlen(WIFI_SSID);
    params.psk = WIFI_PSK;
    params.psk_length = strlen(WIFI_PSK);
    params.security = WIFI_SECURITY_TYPE_PSK;
    params.channel = WIFI_CHANNEL_ANY;
    params.timeout = K_SECONDS(20);

    LOG_INF("Connecting to WiFi...");

    ret = net_mgmt(NET_REQUEST_WIFI_CONNECT, iface,
                   &params, sizeof(params));

    if (ret) {
        LOG_ERR("WiFi connect failed (%d)", ret);
        return 0;
    }

    /* wait for connection */
    while (!connected) {
        k_sleep(K_MSEC(500));
    }

    LOG_INF("Starting LED blink");

    while (1) {
        gpio_pin_toggle_dt(&led);
        k_sleep(K_MSEC(500));
    }
}