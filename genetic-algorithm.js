var GA = function () {
    this.target        = 'To be or not to be';
    this.popsize       = 200;
    this.generation    = 0;
    this.population    = [];
    this.mutation_rate = 0.01;
    this.running       = false;

    this.initialize = function () {
        this.running       = true;
        this.generation    = 0;
        this.population    = [];
        this.target        = document.getElementById('target').value;
        this.popsize       = document.getElementById('popsize').value * 1;
        this.mutation_rate = document.getElementById('mutation_rate').value * 1;
        this.generatePopulation();
        this.evolve(0);
    }

    this.stop = function () {
        this.running = false;
    }

    this.generatePopulation = function () {
        for (var i = 0; i < this.popsize; i++) {
            this.population.push((new DNA(this.target.length)).generate());
        }
    };

    this.pickParent = function (max_fitness) {
        var i = 0;
        while (i++ < 9999) {
            var rand_index = Tools.rand(0, this.popsize - 1);
            if (Tools.rand(0, Math.pow(max_fitness, 3)) < Math.pow(this.population[rand_index].fitness, 3)) break;
        }
        return this.population[rand_index];
    }

    this.render = function (average_fitness, best_result) {
        document.getElementById('average_fitness').innerHTML = this.population.reduce(function (c, v) {
            return c + v.fitness;
        }, 0) / this.popsize;
        document.getElementById('generation').innerHTML      = this.generation;

        this.population.sort(function (a, b) {
            return b.fitness - a.fitness;
        });

        var field       =  document.getElementById('best_result');
        field.innerHTML = '';
        field.appendChild(document.createTextNode(this.population[0].chromosomes.join('')));
        if (this.population[0].fitness === this.target.length) this.running = false;

        var populations = '';
        var field = document.getElementById('populations');
        field.innerHTML = '';
        for (var i in this.population) {
            field.appendChild(document.createTextNode(this.population[i].fitness + '\t' + this.population[i].chromosomes.join('')));
            field.innerHTML += '<br>';
        }
    }

    this.evolve = function () {
        // Calculating fitness
        var total_fitness = 0;
        var max_fitness   = 0;
        for (var i in this.population) {
            this.population[i].calculateFitness(this.target);
            if (this.population[i].fitness > max_fitness) {
                max_fitness = this.population[i].fitness;
            }
        }

        // Picking parents
        this.population.sort(function (a, b) {
            return b.fitness - a.fitness;
        });
        var new_population = [];
        for (var i = 0; i < this.popsize; i++) {
            //var parent_a = this.pickParent(max_fitness);
            //var parent_b = this.pickParent(max_fitness);
            var parent_a = this.population[Tools.rand(0, 10)];
            var parent_b = this.population[Tools.rand(0, 10)];
            var child    = new DNA(this.target.length);
            child.crossover(parent_a, parent_b, this.mutation_rate, this.target);
            child.calculateFitness(this.target);
            new_population.push(child);
        }
        this.population = new_population;

        this.render();

        this.generation++;

        var that = this;
        //setTimeout(function () {
        if (!this.running) return;
            window.requestAnimationFrame(that.evolve.bind(that));
        //}, 100);
    }

    
}

var Tools = {
    rand: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
};

var DNA = function (length) {
    this.chromosomes = [];
    this.fitness     = 0;

    this.calculateFitness = function (target) {
        this.fitness = 0;
        for (var i = 0; i < target.length; i++) {
            if (target[i] === this.chromosomes[i]) this.fitness++;
        }
        return this.fitness;
    };

    this.randomChromosome = function () {
        return String.fromCharCode(Tools.rand(0x20, 0x7E));
    }
    
    this.generate = function () {
        for (var i = 0; i < length; i++) {
            this.chromosomes.push(this.randomChromosome());
        }
        return this;
    }

    this.crossover = function (a, b, mutation_rate, target) {
        for (var i in a.chromosomes) {
            this.chromosomes[i] = 
                Math.random() < mutation_rate ? 
                this.randomChromosome() : 
                (Math.random() < 0.5 ? a.chromosomes[i] : b.chromosomes[i]);
        }
        this.calculateFitness(target);
    }
};

