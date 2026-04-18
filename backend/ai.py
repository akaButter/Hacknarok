def compute_comfort(bus, user):
    base = 5

    # warunki globalne
    if bus.temperature and bus.temperature > 28:
        base -= 2

    if bus.people_count and bus.people_count > 20:
        base -= 2

    # personalizacja
    if user.age:
        base -= (user.age / 100)

    return max(1, min(8, int(base)))