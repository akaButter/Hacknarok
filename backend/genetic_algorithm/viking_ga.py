import random
import json
from datetime import datetime
from models import Attraction, BusState, Route
from ai import compute_comfort

class VikingOptimizer:
    def __init__(self, db, user, tour_size=5):
        self.db = db
        self.user = user
        self.tour_size = tour_size
        self.all_attractions = db.query(Attraction).all()
        self.attraction_ids = [a.id for a in self.all_attractions]
        #self.current_hour = datetime.now().hour
        self.current_hour = 12

    def get_best_bus_comfort(self, route_id):
        """Finds the single most optimal bus on the line right now."""
        buses = self.db.query(BusState).filter_by(route_id=route_id).all()
        if not buses:
            return 0  # Path is impossible if no buses exist
        
        # Evaluate each bus using the real AI model
        scores = [compute_comfort(bus, self.user) for bus in buses]
        return max(scores)

    def calculate_distance(self, lat1, lon1, lat2, lon2):
        """Simple Pythagorean distance to penalize long travel times."""
        return ((lat1 - lat2)**2 + (lon1 - lon2)**2)**0.5

    def evaluate_fitness(self, tour):
        """The Master Evaluation Function."""
        total_score = 0
        
        for i in range(len(tour)):
            attr = next(a for a in self.all_attractions if a.id == tour[i])

            if not (attr.open_hour <= self.current_hour < attr.close_hour):
                return 0 # Gene is dead

            total_score += compute_comfort(attr, self.user)

            if i > 0:
                # Add comfort of the BEST bus on the route leading here
                transit_score = self.get_best_bus_comfort(attr.route_id)
                if transit_score == 0: return 0
                total_score += transit_score

                # Penalty for distance from previous stop (Geography matters!)
                prev_attr = next(a for a in self.all_attractions if a.id == tour[i-1])
                dist = self.calculate_distance(attr.lat, attr.lng, prev_attr.lat, prev_attr.lng)
                total_score -= (dist * 10) # Adjust multiplier to tune 'laziness'

        return max(total_score, 0)

    def select_parent(self, population):
        """Tournament Selection: Pick 3 random tours, best one wins breeding rights."""
        tournament = random.sample(population, k=min(3, len(population)))
        tournament.sort(key=lambda t: self.evaluate_fitness(t), reverse=True)
        return tournament[0]

    def crossover(self, parent1, parent2):
        """Ordered Crossover (OX1) - essential for permutation problems."""
        size = self.tour_size
        start, end = sorted(random.sample(range(size), 2))
        
        child = [None] * size
        child[start:end] = parent1[start:end]
        
        # Fill remaining slots with Parent 2 genes while maintaining order
        p2_pointer = 0
        for i in range(size):
            if child[i] is None:
                while parent2[p2_pointer] in child:
                    p2_pointer += 1
                child[i] = parent2[p2_pointer]
        return child

    def mutate(self, tour, mutation_rate=0.15):
        """Swaps two stops to explore new combinations."""
        if random.random() < mutation_rate:
            idx1, idx2 = random.sample(range(self.tour_size), 2)
            tour[idx1], tour[idx2] = tour[idx2], tour[idx1]
        return tour

    def evolve(self, pop_size=30, generations=100):
        """The Main Evolutionary Loop."""
        # Initial Population
        population = [random.sample(self.attraction_ids, self.tour_size) for _ in range(pop_size)]
        
        for gen in range(generations):
            # Sort by fitness (Elitism)
            population.sort(key=lambda t: self.evaluate_fitness(t), reverse=True)
            
            # Keep top 2 survivors
            new_population = population[:2]
            
            while len(new_population) < pop_size:
                p1 = self.select_parent(population)
                p2 = self.select_parent(population)
                
                child = self.crossover(p1, p2)
                child = self.mutate(child)
                new_population.append(child)
            
            population = new_population
            
        return population[0] # Return the most fabulous tour found