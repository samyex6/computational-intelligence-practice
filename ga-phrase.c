// Genetic Algorithm - String Matching
// Crossover method: inherit randomly from both parents
// Fitness method: directly compare chars at certain index

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define POPSIZE    2000
#define MUTATERATE 1

char target[]   = "Use the Main Menu to navigate through your ISIS account. In ISIS you can update personal details, pay your fees and invoices, access your academic results and enrol in courses. It is important that you login to both ISIS and your ANU Student Email account often, as ISIS and ANU Email are the primary methods that the University will communicate with you.";
int  target_len = sizeof(target) - 1;

struct INDIVIDUAL {
    int  fitness;
    char *dna;
};

float randFloat (float min, float max) {
    return (max - min) * ((float) rand() / RAND_MAX) + min;
}

char generateChar () {
    char rand_char = (rand() % (0x7E - 0x20 + 1)) + 0x20;
    return rand_char;
}

void generatePopulation (struct INDIVIDUAL population[POPSIZE]) {
    int i, j;
    for (i = 0; i < POPSIZE; i++) {
        population[i].dna = malloc(sizeof(char) * target_len);
        for (j = 0; j < target_len; j++) {
            population[i].dna[j] = generateChar();
        }
    }
}

void calculateFitness (struct INDIVIDUAL *ind) {
    int i;
    ind->fitness = 0;
    for (i = 0; i < target_len; i++) {
        if (target[i] == ind->dna[i]) ind->fitness++;
    }
}

int generateRandomIndex(struct INDIVIDUAL population[POPSIZE], int max_fitness) {
    int max_iteration = 999999;
    int i = 0;
    while (i++ < max_iteration) {
        int rand_index = rand() % POPSIZE;
        if (randFloat(0, 1) >= population[rand_index].fitness / max_fitness) continue;
        return rand_index;
    }
    return 0;
}

int evolve (struct INDIVIDUAL population[POPSIZE]) {
    // Calculating fitness and copy them into a new array;
    int i;
    int max_fitness   = -999;
    int max_index     = -1;
    for (i = 0; i < POPSIZE; i++) {
        calculateFitness(&population[i]);
        if (population[i].fitness > max_fitness) {
            max_fitness = population[i].fitness;
            max_index   = i;
        }
    }
    printf("%s\n", population[max_index].dna);

    int j;
    struct INDIVIDUAL new_population[POPSIZE];
    for (i = 0; i < POPSIZE; i++) {
        // Cross over & mutate
        struct INDIVIDUAL child;
        struct INDIVIDUAL parent_a = population[generateRandomIndex(population, max_fitness)];
        struct INDIVIDUAL parent_b = population[generateRandomIndex(population, max_fitness)];
        //int rand_cut = rand() % POPSIZE;
        child.dna = malloc(sizeof(char) * target_len);
        for (j = 0; j < target_len; j++) {
            //child.dna[j] = (rand() % 100) < MUTATERATE ? generateChar() : (j <= rand_cut ? parent_a.dna[j] : parent_b.dna[j]);
            child.dna[j] = (rand() % 100) < MUTATERATE ? generateChar() : (rand() % 2 == 0 ? parent_a.dna[j] : parent_b.dna[j]);
        }
        new_population[i] = child;
    }

    // Finished evolving
    for (i = 0; i < POPSIZE; i++) {
        population[i] = new_population[i];
    }

    return max_fitness;
}

int main () {

    srand(time(NULL));

    struct INDIVIDUAL population[POPSIZE];
    generatePopulation(population);

    int i = 0;
    while (++i) {
        int max_fitness = evolve(population);
        if (max_fitness == target_len) {
            printf("%s\n", target);
            printf("Generations: %d\n", i - 1);
            break;
        }
    }

    return 0;
}
