#ifndef PEOPLE_COUNTER_H
#define PEOPLE_COUNTER_H

#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

int people_counter_init(void);

/* start background thread */
void people_counter_start(void);

/* getter */
int people_counter_get(void);

/* reset if needed */
void people_counter_reset(void);

#ifdef __cplusplus
}
#endif

#endif